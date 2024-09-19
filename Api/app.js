'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//CARGAR RUTAS
var odoo_routes = require('./routes/odoo.routes');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// configurar cabeceras http
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Method', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');

    next();
})

// RUTAS BASE

app.use('/api', odoo_routes);
app.get('/pruebas', (req, res) => {
    res.status(200).send({ message: 'Bienvenido al servicio de prueba.' });
})

module.exports = app;