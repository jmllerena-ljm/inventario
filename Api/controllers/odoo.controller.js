'use strict'
var OdooModel = require('../models/odoo');

// var fs = require('fs');
// var path = require('path');
// var bcrypt = require('bcrypt-nodejs');
// var User = require('../models/user');
// var jwt = require('../services/jwt');
const Sequelize = require('sequelize')

const seqlz = new Sequelize('Lajoya_2018', 'openpg', 'openpgpwd', {
    host: '192.168.77.21',
    dialect: 'postgres',
})

function getMaterial(req, res) {
    seqlz.query("SELECT * FROM product_product", { type: seqlz.QueryTypes.SELECT })
        .then(products => {
            res.status(200).send({ Data: products })
        })
}

function getProductos(req, res) {
    seqlz.query("SELECT in_date, name, currency_id FROM purchase_liquidation ORDER BY in_date DESC LIMIT 100", { type: seqlz.QueryTypes.SELECT })
        .then(products => {
            res.status(200).send({ Data: products })
        })
}

function getLotes(req, res) {
    var lote = (req.params.name) ? req.params.name : '15939';
    seqlz.query("SELECT * FROM purchase_liquidation WHERE name='" + lote + "'", { type: seqlz.QueryTypes.SELECT })
        .then(products => {
            res.status(200).send({ Data: products })
        })
}

function getZonas(req, res) {
    seqlz.query("SELECT * FROM table_zone", { type: seqlz.QueryTypes.SELECT })
        .then(products => {
            res.status(200).send({ Data: products })
        })
}

function getAcopiadores(req, res) {
    seqlz.query("SELECT * FROM table_acopiador", { type: seqlz.QueryTypes.SELECT })
        .then(products => {
            res.status(200).send({ Data: products })
        })
}

function getProveedores(req, res) {
    var id = req.params.id;
    seqlz.query("SELECT * FROM res_partner WHERE type_number='" + id + "' LIMIT 100", { type: seqlz.QueryTypes.SELECT })
        .then(products => {
            res.status(200).send({ Data: products })
        })
}

function insertLote(req, res) {
    var lote_data = OdooModel.getLote();
    var query = `INSERT INTO purchase_liquidation (create_date, acopiador, qty, value_consumed, create_uid, is_especial,
        supplier_id, cianuro, ley_oz_au, state, ley_oz_ag, lot, tmh, presentation, g_adm, percentage_recovery,
        write_date, maquila, write_uid, name, source_zone, h2o, soda, in_date, sample_date, date_neg, date_lab,
        date_bal, forzar_nombre, material, vssoles, vsdolar, mes, maquila_dol, reintegro_dol, flete,
        precio_tm_dol, importe_dol, precio_dol, nuevo_importe_dol, penalidad, percentage_recovery_ag)
        VALUES (
        '${lote_data.create_date}',
        '${lote_data.acopiador}',
        '${lote_data.qty}',
        '${lote_data.value_consumed}',
        '${lote_data.create_uid}',
        '${lote_data.is_especial}',
        '${lote_data.supplier_id}',
        '${lote_data.cianuro}',
        '${lote_data.ley_oz_au}',
        '${lote_data.state}',
        '${lote_data.ley_oz_ag}',
        '${lote_data.lot}',
        '${lote_data.tmh}',
        '${lote_data.presentation}',
        '${lote_data.g_adm}',
        '${lote_data.percentage_recovery}',
        '${lote_data.write_date}',
        '${lote_data.maquila}',
        '${lote_data.write_uid}',
        '${lote_data.name}',
        '${lote_data.source_zone}',
        '${lote_data.h2o}',
        '${lote_data.soda}',
        '${lote_data.in_date}',
        '${lote_data.sample_date}',
        '${lote_data.date_neg}',
        '${lote_data.date_lab}',
        '${lote_data.date_bal}',
        '${lote_data.forzar_nombre}',
        '${lote_data.material}',
        '${lote_data.vssoles}',
        '${lote_data.vsdolar}',
        '${lote_data.mes}',
        '${lote_data.maquila_dol}',
        '${lote_data.reintegro_dol}',
        '${lote_data.flete}',
        '${lote_data.precio_tm_dol}',
        '${lote_data.importe_dol}',
        '${lote_data.precio_dol}',
        '${lote_data.nuevo_importe_dol}',
        '${lote_data.penalidad}',
        '${lote_data.percentage_recovery_ag}')`;

    seqlz.query(query, { type: seqlz.QueryTypes.INSERT })
        .then(products => {
            res.status(200).send({ Data: products })
        })
        // res.status(200).send({ message: 'Insertando' })
}

module.exports = {
    getProductos,
    getLotes,
    getZonas,
    getAcopiadores,
    getProveedores,
    getMaterial,
    insertLote
};