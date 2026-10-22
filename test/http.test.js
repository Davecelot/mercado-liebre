const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const { once } = require('node:events');
const net = require('node:net');
const { after, before, test } = require('node:test');
const path = require('node:path');

let child;
let baseUrl;

before(async () => {
    const reservation = net.createServer();
    reservation.listen(0, '127.0.0.1');
    await once(reservation, 'listening');
    const port = reservation.address().port;
    await new Promise(resolve => reservation.close(resolve));
    child = spawn(process.execPath, ['src/app.js'], {
        cwd: path.resolve(__dirname, '..'),
        env: { ...process.env, PORT: String(port) },
        stdio: ['ignore', 'pipe', 'pipe'],
    });
    let stderr = '';
    child.stderr.on('data', data => { stderr += data; });
    await Promise.race([
        once(child.stdout, 'data'),
        once(child, 'exit').then(([code]) => {
            throw new Error(`Server exited ${code}: ${stderr}`);
        }),
    ]);
    baseUrl = `http://127.0.0.1:${port}`;
}, { timeout: 10000 });

after(async () => {
    if (child && child.exitCode === null) {
        child.kill();
        await once(child, 'exit');
    }
});

for (const route of ['/', '/login', '/register']) {
    test(`GET ${route} renders its page`, async () => {
        const response = await fetch(`${baseUrl}${route}`);
        assert.equal(response.status, 200);
        assert.match(await response.text(), /<html/i);
    });
}

for (const route of ['/login', '/register']) {
    test(`${route} demonstration cannot collect credentials or submit them in a URL`, async () => {
        const response = await fetch(`${baseUrl}${route}`);
        const html = await response.text();
        const form = html.match(/<form\b[^>]*class="form"[^>]*>([\s\S]*?)<\/form>/i);
        assert.ok(form, 'account demonstration form exists');
        assert.match(form[0], /method="post"/i, 'form must never serialize credentials into a GET URL');
        const passwordInput = form[0].match(/<input\b[^>]*type="password"[^>]*>/i);
        assert.ok(passwordInput);
        assert.match(passwordInput[0], /\bdisabled(?:\s|>)/i, 'demonstration must not accept real passwords');
        assert.match(form[0], /<button\b[^>]*type="submit"[^>]*\bdisabled(?:\s|>)/i);
        assert.match(form[0], /demostración/i);
    });

    test(`POST ${route} cannot create an account or establish a session`, async () => {
        const response = await fetch(`${baseUrl}${route}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: 'user=security-test&password=not-a-real-password',
        });
        assert.equal(response.status, 404);
        assert.equal(response.headers.get('set-cookie'), null);
        assert.doesNotMatch(await response.text(), /not-a-real-password/);
    });
}

test('static assets remain available and source files remain outside the public root', async () => {
    const stylesheet = await fetch(`${baseUrl}/css/style.css`);
    assert.equal(stylesheet.status, 200);
    assert.match(stylesheet.headers.get('content-type'), /text\/css/);
    const source = await fetch(`${baseUrl}/src/app.js`);
    assert.equal(source.status, 404);
});
