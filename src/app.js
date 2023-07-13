const express = require("express");
const app = express();
const path = require('path');
const mainRoutes = require('./routes/mainRoutes');
const PORT = process.env.PORT || 3030;

app.use(express.static(path.resolve(__dirname, '../public')));

app.listen(PORT, () => {
    console.log('Servidor corriendo en http://localhost:' + PORT + ' exitosamente.');
});

app.set('view engine', 'ejs')

app.set("views", "src/views");

app.use('/', mainRoutes);