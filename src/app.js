const express = require("express");
const app = express();
const path = require("path");
const PORT = 3030;

app.use(express.static(path.resolve(__dirname, '../public')));

app.listen(PORT, () => {
    console.log('Servidor corriendo en http://localhost:' + PORT + ' exitosamente.');
});

app.get('/', function(req, res) {
    res.sendFile(path.resolve(__dirname, '../views/home.html'));
})