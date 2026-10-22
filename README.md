# Case of study: Mercado Liebre

## Run and validate locally

Use Node.js 24.22.1 or a newer patched release in the 24.x line (`.nvmrc` pins
the verified baseline).

```sh
npm ci
npm start
npm run dev  # Node's built-in file watcher
npm test
npm audit --audit-level=low
```

Login and registration are visual demonstrations only. Their password fields
and submit buttons are disabled because this project does not authenticate users
or create accounts. The forms use POST as a fallback so credentials cannot be
serialized into browser history or server access-log URLs. Do not enter real
personal information into the demonstration fields.

## What's Mercado Liebre?

Mercado Liebre is a study project developed for the first part of my Digital House's certification as Full Stack Node Developer, specifically for the HTML and CSS modules.

- Link to the project :point_right: https://davecelot-mercado-liebre.onrender.com/

## What did I do?

I copied the design from Mercado Libre and some mockups provided for Digital House as part of the tasks to approve the modules about HTML and CSS.

## How much time did the project take?

The challenges/tasks were presented as we progressed with the content from the CSS and the HMTL modules. We had a month to deliver the final product.

## Step by step

- First we created the structure of files for the entire project

- Then we worked on the HTML files for the different views of Mercado Liebre: index (home), login and signup

- As we learned about CSS, we worked the CSS for the diferrent views designing mobile first so that Mercado Liebre is 100 % responsive for mobile, tablet and desktop

- To showcase the project and host it somewhere we implemented Render

- Last but not least, I migrated the entire project from HTML to a template engine (EJS) and the MVC pattern structure to modularize it. This was in addition to the required tasks, and it wasn't part of the challanges to do
