'use strict'

const Sequelize = require('sequelize')
var app = require('./app');
var port = process.env.PORT || 3939;

const sequelize = new Sequelize('Lajoya_2018', 'openpg', 'openpgpwd', {
    host: '192.168.77.21',
    dialect: 'postgres',
})

sequelize.authenticate().then((err, res) => {
        if (err) {
            throw err;
        } else {
            console.log('Connection established successfully.');
            app.listen(port, function() {
                console.log("Servidor del Api Rest de musica escuchando en http://localhost:" + port);
            })
        }
    }).catch(err => {
        console.error('Unable to connect to the database:', err);
    })
    // .finally(() => {
    // sequelize.close();
    // });