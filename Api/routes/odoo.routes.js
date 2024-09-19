'use strict'

var express = require('express');
var OdooController = require('../controllers/odoo.controller');

var api = express.Router();
// var md_auth = require('../middlewares/authenticated');

// var multipart = require('connect-multiparty');
// var md_upload = multipart({ uploadDir: './uploads/users' });

api.get('/odoo/productos', OdooController.getProductos);
api.get('/odoo/lotes/:name?', OdooController.getLotes);
api.get('/odoo/zonas', OdooController.getZonas);
api.get('/odoo/acopiadores', OdooController.getAcopiadores);
api.get('/odoo/proveedores/:id', OdooController.getProveedores);
api.get('/odoo/material/:id?', OdooController.getMaterial);
api.post('/odoo/lotes/insert', OdooController.insertLote);

module.exports = api;