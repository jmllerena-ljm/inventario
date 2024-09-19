import moment from 'moment';
const Sequelize = require('sequelize')

export const mongodb = {
    // Localhost
    // "URI": "mongodb://localhost:27017/dbInventory" // BD Inventario Dev
    // "URI": "mongodb://localhost:27017/dbMaxpi" // BD Maxpi Dev
    // Containers Docker
    // "URI": "mongodb://host.docker.internal:27017/dbInventory" // BD Inventario Dev
    // "URI": "mongodb://host.docker.internal:27017/dbMaxpi" // BD Maxpi Dev
    // "URI": "mongodb://root:lajoy%40987.@192.168.77.22:27017/dbInventory"
    //"URI": "mongodb://root:lajoy%40987.@54.224.61.111:27017/dbInventory",
    // BD Inventario Prod
    "URI": "mongodb://root:lajoy%40987.@54.224.61.111:27017/dbInventory?serverSelectionTimeoutMS=5000&connectTimeoutMS=10000&authSource=admin&authMechanism=SCRAM-SHA-256&3t.uriVersion=3&3t.alwaysShowAuthDB=true&3t.alwaysShowDBFromUserRole=true"
    // BD Maxpi Dev
    // "URI": "mongodb://root:lajoy%40987.@54.224.61.111:27017/dbMaxpi?serverSelectionTimeoutMS=5000&connectTimeoutMS=10000&authSource=admin&authMechanism=SCRAM-SHA-256&3t.uriVersion=3&3t.alwaysShowAuthDB=true&3t.alwaysShowDBFromUserRole=true"
}
// export const seqlz = new Sequelize('Lajoya_2019', 'postgres', 'lajoy@987.', {
//     host: 'localhost',
//     dialect: 'postgres',
//     logging: false,
//     pool: {
//         max: 5,
//         min: 0,
//         idle: 10000s
//     }
// })
export const seqlz = new Sequelize('Lajoya_2020', 'openpg', 'l4j0y4m1n1ngLJM23', {
    host: '192.168.77.21', // '190.119.108.242', //prod
    dialect: 'postgres',
    logging: false,
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
})
// Lajoya_Concesiones
export const seqlz_conce = new Sequelize('Lajoya_Concesiones', 'openpg', 'l4j0y4m1n1ngLJM23', {
    host: '192.168.77.21', // '190.119.108.242', //prod
    dialect: 'postgres',
    logging: false,
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
})
export const secret = 'fd691fb88a43a36a40427a1aae563252c0601371c5839379a063b81a3bf927dd';
export const credential_mail = { email: 'notificaciones@grupolajoya.com.pe', pass: '@%nt.ljm.2024.%%'};
export const path_documents = './uploads/';
export const api_url_odoo = 'https://lajoyash-joya2020.odoo.com/api/webservice/';
// prod
export const api_url_sig = 'http://54.224.61.111/Ljm_Service_Manager/api/'; // API Sistema de Gestión
// dev
//export const api_url_sig = 'http://localhost:59152/api/'; // API Sistema de Gestión
export const partner_name = 'ljm_api_user';
export const credential = 'dac2175712932b0a63b23c3daab88db5762b13b1591416810f8c0d1e86998630';
export const credential_odoo13 = { user: 'APIJoyaUser', pass: 'Api$pass&256Gt4tHE63' };