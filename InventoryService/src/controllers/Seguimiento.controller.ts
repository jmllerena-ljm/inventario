import {Request, Response} from 'express';
import SeguimientoModel from '../models/tblSeguimiento';
import AlmacenModel from '../models/tblAlmacen';
import CompanyModel from '../models/tblCompany';

import { seqlz, seqlz_conce } from '../keys';

class SeguimientoController {

    public async searchOdooSeguimiento(req: Request, res: Response) {
        let count = parseInt(req.params.count);
        let page = (req.params.page) ? (parseInt(req.params.page) - 1) : 0;
        const skip = page * count;
        let connection: any = (req.body.database==1) ? seqlz : seqlz_conce;

        let _lic_name = '%'+req.body.lic_name+'%';
        let _prod_name = '%'+req.body.prod_name+'%';
        let _solicitante = '%'+req.body.solicitante+'%';
        let _type = req.body.type;
        let _solpe = req.body.number_solpe;
        let _guide = req.body.guide;
        let _con_saldo = req.body.con_saldo;
        let _date_ini = req.body.date_ini;
        let _date_fin = req.body.date_fin;

        count = ((req.body.lic_name==''&&req.body.prod_name==''&&req.body.solicitante=='')
                    &&(_type!=''|| _solpe!='' || _guide!=''|| _con_saldo)) ? 1000 : count;

        let _query = `SELECT lic.id AS lic_id,lic.number AS lic_number,lic.fecha AS lic_date,
                emp.name_related AS solicitante,area.name AS area_odoo,lic_det.id AS lic_det_id, lic_det.centro_costo,
                prod.id AS prod_id,prod.default_code AS prod_code,prod.name_template AS prod_name,
                lic_det.descripcion,uom.name AS uom,lic_det.justificacion,lic_det.prioridad,lic_det.cantidad,
                lic_det.fecha_llegada, lic.state,
                (SELECT string_agg(po.name, ' ') FROM purchase_order_line AS po_line
                    INNER JOIN purchase_order AS po ON po_line.order_id = po.id
                    WHERE po.state NOT IN ('draft', 'sent', 'bid') AND po_line.licitacion_advance_linea_id = lic_det.id) AS po_name,
                (SELECT SUM(po_line.product_qty) AS po_qty FROM purchase_order_line AS po_line
                    INNER JOIN purchase_order AS po ON po_line.order_id = po.id
                    WHERE po.state NOT IN ('draft', 'sent', 'bid') AND po_line.licitacion_advance_linea_id = lic_det.id) AS po_qty
            FROM licitacion_advance_linea AS lic_det
                INNER JOIN licitacion_advance AS lic ON lic_det.padre = lic.id
                INNER JOIN hr_employee AS emp ON lic.solicitante = emp.id
                INNER JOIN area_table AS area ON lic.area = area.id
                INNER JOIN product_product AS prod ON lic_det.product_id = prod.id
                INNER JOIN product_template AS templ ON prod.product_tmpl_id = templ.id
                INNER JOIN product_uom AS uom ON templ.uom_id = uom.id
            WHERE (lic.number ILIKE :lic_name OR lic.number ISNULL)
                AND (lic_det.descripcion ILIKE :prod_name OR lic_det.descripcion ISNULL)
                AND (emp.name_related ILIKE :solicitante OR emp.name_related ISNULL)
                AND (lic.fecha >= '${_date_ini}' AND lic.fecha <= '${_date_fin}')
            ORDER BY lic.number DESC
            LIMIT :limit OFFSET :offset`;

        let _query_total = `SELECT COUNT(lic_det.id) FROM licitacion_advance_linea AS lic_det INNER JOIN licitacion_advance AS lic ON lic_det.padre = lic.id WHERE (lic.fecha >= '${_date_ini}' AND lic.fecha <= '${_date_fin}')`;
        
        try {
            let tracings = await connection.query(_query, {
                replacements: { lic_name: _lic_name, prod_name: _prod_name, solicitante: _solicitante, limit: count, offset: skip },
                type: connection.QueryTypes.SELECT
            });
            let _total = await connection.query(_query_total, { type: connection.QueryTypes.SELECT, plain: true })

            for (let i = 0; i < tracings.length; i++) {
                const element = await SeguimientoModel.findOne({lic_id: tracings[i].lic_id, lic_det_id: tracings[i].lic_det_id});
                tracings[i].id_seg_mongo = (element)? element._id : '-1';
                tracings[i].authorized = (element)? element.authorized : false;
                tracings[i].date2 = (element)? element.date2 : '';
                tracings[i].type = (element)? element.type : '';
                tracings[i].number_solpe = (element)? element.number_solpe : '';
                tracings[i].guide = (element)? element.guide : '';
                tracings[i].quoted = (element)? element.quoted : 0;
                tracings[i].purchase = (element)? element.purchase : 0;
                tracings[i].received = (element)? element.received : 0;
                tracings[i].sent = (element)? element.sent : 0;
                tracings[i].send_date = (element)? element.send_date : '';
                tracings[i].period = (element)? element.period : '';
                tracings[i].area = (element)? element.area : '';
                tracings[i].company = (element)? element.company : req.body.database;
                tracings[i].check_seg = false;
                
                tracings[i].saldo_pedir = tracings[i].cantidad - (tracings[i].po_qty? tracings[i].po_qty : 0);
                tracings[i].check_status = (tracings[i].saldo_pedir <= 0) ? true : false;
            }

            let tracings_saldo = (_con_saldo) ? tracings.filter((sld: any) => sld.saldo_pedir > 0) : tracings;

            if(_type !== '' || _solpe !== '' || _guide !== '') {
                let flag = (_type==='vacio' || _solpe==='vacio' || _guide==='vacio')? true : false;
                if(flag) {
                    let tracings_vacios: any = [];
                    if(_type==='vacio') {
                        tracings_vacios = tracings_saldo.filter((item: any) =>  item.type === '');
                    } else if(_solpe=='vacio') {
                        tracings_vacios = tracings_saldo.filter((item: any) =>  item.number_solpe === '');
                    } else {
                        tracings_vacios = tracings_saldo.filter((item: any) =>  item.guide === '');
                    }
                    res.status(200).send({ Data: tracings_vacios, Page: tracings_vacios.length, Count: tracings_vacios.length});
                } else {
                    let tracing_filter = tracings_saldo.filter((item: any) =>  item.type.toLowerCase().indexOf(_type.toLowerCase()) > -1
                                                    && item.number_solpe.toLowerCase().indexOf(_solpe.toLowerCase()) > -1
                                                    && item.guide.toLowerCase().indexOf(_guide.toLowerCase()) > -1);
                    res.status(200).send({ Data: tracing_filter, Page: tracing_filter.length, Count: tracing_filter.length});
                }
                
            } else {
                res.status(200).send({ Data: tracings_saldo, Page: tracings_saldo.length, Count: _total.count });
            }
        } catch(err) {
            res.status(404).send({ message: 'Error al cargar Seguimientos', error: err });
        }
    }

    public async downloadOdooSeguimiento(req: Request, res: Response) {        
        let connection: any = (req.body.database==1) ? seqlz : seqlz_conce;
        let _date_ini = req.body.date_ini;
        let _date_fin = req.body.date_fin;

        let _query = `SELECT lic.id AS lic_id, lic_det.id AS lic_det_id, lic.number AS lic_number,lic.fecha AS lic_date,
                emp.name_related AS solicitante,area.name AS area_odoo,
                prod.default_code AS prod_code,prod.name_template AS prod_name,
                lic_det.descripcion,uom.name AS uom,lic_det.justificacion,lic_det.prioridad,lic_det.cantidad,
                lic_det.fecha_llegada, lic.state,
                (SELECT string_agg(po.name, ' ') FROM purchase_order_line AS po_line
                    INNER JOIN purchase_order AS po ON po_line.order_id = po.id
                    WHERE po.state NOT IN ('draft', 'sent', 'bid') AND po_line.licitacion_advance_linea_id = lic_det.id) AS po_name,
                (SELECT SUM(po_line.product_qty) AS po_qty FROM purchase_order_line AS po_line
                    INNER JOIN purchase_order AS po ON po_line.order_id = po.id
                    WHERE po.state NOT IN ('draft', 'sent', 'bid') AND po_line.licitacion_advance_linea_id = lic_det.id) AS po_qty
            FROM licitacion_advance_linea AS lic_det
                INNER JOIN licitacion_advance AS lic ON lic_det.padre = lic.id
                INNER JOIN hr_employee AS emp ON lic.solicitante = emp.id
                INNER JOIN area_table AS area ON lic.area = area.id
                INNER JOIN product_product AS prod ON lic_det.product_id = prod.id
                INNER JOIN product_template AS templ ON prod.product_tmpl_id = templ.id
                INNER JOIN product_uom AS uom ON templ.uom_id = uom.id
            WHERE (lic.fecha >= '${_date_ini}' AND lic.fecha <= '${_date_fin}')
            ORDER BY lic.number DESC`;
        
        try {
            let tracings = await connection.query(_query, {
                type: connection.QueryTypes.SELECT
            });
            
            for (let i = 0; i < tracings.length; i++) {
                const element = await SeguimientoModel.findOne({lic_id: tracings[i].lic_id, lic_det_id: tracings[i].lic_det_id});
                tracings[i].id_seg_mongo = (element)? element._id : '-1';
                tracings[i].authorized = (element)? element.authorized : false;
                tracings[i].date2 = (element)? element.date2 : '';
                tracings[i].type = (element)? element.type : '';
                tracings[i].number_solpe = (element)? element.number_solpe : '';
                tracings[i].guide = (element)? element.guide : '';
                tracings[i].quoted = (element)? element.quoted : 0;
                tracings[i].purchase = (element)? element.purchase : 0;
                tracings[i].received = (element)? element.received : 0;
                tracings[i].sent = (element)? element.sent : 0;
                tracings[i].send_date = (element)? element.send_date : '';
                tracings[i].period = (element)? element.period : '';
                tracings[i].company = (element)? element.company : req.body.database;
                tracings[i].check_seg = false;
                
                tracings[i].saldo_pedir = tracings[i].cantidad - (tracings[i].po_qty? tracings[i].po_qty : 0);
                tracings[i].check_status = (tracings[i].saldo_pedir <= 0) ? true : false;
            }
            res.status(200).send({ Data: tracings });
        } catch(err) {
            res.status(404).send({ message: 'Error al cargar Seguimientos', error: err });
        }
    }

    public async getSeguimiento(req: Request, res: Response) {
        const idLicitacion = req.params.licid;
        const idLicitacionDet = req.params.licdetid;
        const idProduct = req.params.productid;
        const id_db = req.params.database;
        // let connection: any = (req.params.database=='La Joya Concesiones') ? seqlz_conce : seqlz;
        let connection: any = (parseInt(req.params.database)==1) ? seqlz : seqlz_conce;
        try {
            const _company: any = await CompanyModel.findOne({ code_odoo: parseInt(id_db) });

            const _tracing = await SeguimientoModel.findOne({lic_id: parseInt(idLicitacion), lic_det_id: parseInt(idLicitacionDet), company: _company._id});
            const _product = await AlmacenModel.findOne({product_id: parseInt(idProduct)});
            let _query = `SELECT lic_det.id AS lic_det_id, lic_det.descripcion, lic.id AS lic_id, lic.number, lic.write_date AS date_approved,
                    per.name AS aprobado, po.name AS po, partner.name AS proveedor, po_line.product_qty AS po_qty, po.date_order, cc.name AS cc_name
                FROM licitacion_advance_linea AS lic_det
                	INNER JOIN licitacion_advance AS lic ON lic_det.padre = lic.id
                	LEFT JOIN purchase_order_line AS po_line ON lic_det.id = po_line.licitacion_advance_linea_id
                	LEFT JOIN purchase_order AS po ON po_line.order_id = po.id
                	LEFT JOIN res_partner AS partner ON po.partner_id = partner.id
                	LEFT JOIN res_users AS usr ON lic.write_uid = usr.id
                	LEFT JOIN res_partner AS per ON usr.partner_id = per.id
                    LEFT JOIN account_analytic_account AS cc ON lic_det.centro_costo = cc.id
                WHERE lic_det.id = ${idLicitacionDet}`;
            connection.query(_query, { type: connection.QueryTypes.SELECT })
            .then((detalle: any) => {
                res.status(200).send( {tracing: _tracing, product: _product, detail: detalle} );
            })
        } catch(err) {
            res.status(404).send({ message: 'Error al obtener Seguimiento', error: err });
        }
    }

    public async reporteSeguimiento(req: Request, res: Response) {
        const params = req.body;
        let connection: any = (params.database=='La Joya Concesiones') ? seqlz_conce : seqlz;
        try {
            let ListRep: any = [];
            for (let i = 0; i < params.months.length; i++) {
                const item = params.months[i];
                
                let df_ini: Date = new Date(item.date_ini + 'T00:00:00');
                let df_fin: Date = new Date(item.date_fin + 'T00:00:00');
                let sf_ini: string = item.date_ini + ' 00:00:00';
                let sf_fin: string = item.date_fin + ' 00:00:00';
 
                let _query = `SELECT (SELECT COUNT(lic_det.id) FROM licitacion_advance_linea AS lic_det
                    INNER JOIN licitacion_advance AS lic ON lic_det.padre = lic.id
                    WHERE lic.fecha >='${sf_ini}' and lic.fecha < '${sf_fin}') AS count_bidding`;
                let datos_rep = await connection.query(_query, {
                    type: connection.QueryTypes.SELECT,
                    plain: true
                });
                // Cotizado
                const quoted_total = await SeguimientoModel.countDocuments({
                    lic_date : { $gte: df_ini, $lte: df_fin },
                    number_solpe: { $ne: '' }
                });
                // Comprado
                const purchase_total = await SeguimientoModel.countDocuments({
                    lic_date : { $gte: df_ini, $lte: df_fin },
                    purchase: 100
                });
                // Recibido
                const received_total = await SeguimientoModel.countDocuments({
                    lic_date : { $gte: df_ini, $lte: df_fin },
                    received: 100
                });
                // Atendido
                const send_total = await SeguimientoModel.countDocuments({
                    lic_date : { $gte: df_ini, $lte: df_fin },
                    sent: 100
                });
                datos_rep.id = item.id;
                datos_rep.name = item.name;
                datos_rep.quoted_total = quoted_total;
                datos_rep.purchase_total = purchase_total;
                datos_rep.received_total = received_total;
                datos_rep.send_total = send_total;

                ListRep.push(datos_rep)
            }

            

            res.status(200).send( { Datos: ListRep } );
        } catch (err) {
            res.status(404).send({ message: 'Error al cargar grafico', error: err });
        }
    }
    public async reporteTopCompras(req: Request, res: Response) {
        const params = req.body;
        let connection: any = (params.database=='La Joya Concesiones') ? seqlz_conce : seqlz;
        try {
            let _query = `SELECT lic_det.product_id, prod.name_template AS product_name, COUNT(lic_det.id) AS count_product
            FROM licitacion_advance_linea AS lic_det
            INNER JOIN licitacion_advance AS lic ON lic_det.padre = lic.id
            INNER JOIN product_product AS prod ON lic_det.product_id = prod.id
            WHERE lic.state = 'aprobado' and lic.fecha >='${params.date_ini}' and lic.fecha < '${params.date_fin}'
            GROUP BY product_id, product_name
            ORDER BY count_product DESC
            LIMIT ${params.limit}`;
            let _query2 = `SELECT lic.area, area.name AS area_name, COUNT(lic_det.id) AS count_area
            FROM licitacion_advance_linea AS lic_det
            INNER JOIN licitacion_advance AS lic ON lic_det.padre = lic.id
            INNER JOIN area_table AS area ON lic.area = area.id
            WHERE lic.state = 'aprobado' and lic.fecha >='${params.date_ini}' and lic.fecha < '${params.date_fin}'
            GROUP BY area, area_name
            ORDER BY count_area DESC`;
            let datos_compras = await connection.query(_query, { type: connection.QueryTypes.SELECT });
            let datos_areas = await connection.query(_query2, { type: connection.QueryTypes.SELECT });
            
            res.status(200).send( { Data: datos_compras, DataArea: datos_areas } );
        } catch (err) {
            res.status(404).send({ message: 'Error al cargar Top Compras', error: err });
        }
    }
    
    public async searchSeguimiento(req: Request, res: Response) {
        const params = req.body;
        const tracings = await SeguimientoModel.find(params);
        res.status(200).send( { Data: tracings, Count: tracings.length } );
    }

    public async saveSeguimiento(req: Request, res: Response) {
        const newTracing = new SeguimientoModel();
        let params = req.body;
        const _company: any = await CompanyModel.findOne({ code_odoo: parseInt(params.company) });

        newTracing.lic_id = params.lic_id;
        newTracing.lic_name = params.lic_name;
        newTracing.lic_det_id = params.lic_det_id;
        newTracing.lic_date = params.lic_date;
        newTracing.authorized = params.authorized;
        newTracing.date2 = params.date2;
        newTracing.type = params.type;
        newTracing.number_solpe = params.number_solpe;
        newTracing.quoted = params.quoted;
        newTracing.purchase = params.purchase;
        newTracing.received = params.received;
        newTracing.sent = params.sent;
        newTracing.guide = params.guide;
        newTracing.send_date = params.send_date;
        newTracing.urgent = params.urgent;
        newTracing.period = params.period;
        newTracing.area = params.area;
        newTracing.company = _company._id;
        newTracing.user_update = params.user_update;
        newTracing.date_update = params.date_update;
        newTracing.status = params.status;

        let tracingFind = await SeguimientoModel.findOne({lic_id: newTracing.lic_id, lic_det_id: newTracing.lic_det_id, status: true});
        if(tracingFind) {
            res.status(200).send({ message: 'Ya existe este registro: '+ newTracing.lic_name });
        } else {
            newTracing.save((err, tracingStored) => {
                if (err) {
                    res.status(500).send({ message: 'Error al guardar '+newTracing.lic_name, error: err });
                } else {
                    if (!tracingStored) {
                        res.status(404).send({ message: 'El registro: '+newTracing.lic_name+', no ha sido guardado.' });
                    } else {
                        res.status(200).send({ message: 'Se guardó correctamente: '+ newTracing.lic_name, seguimiento: newTracing });
                    }
                }
            })
        }
    }
    public async updateSeguimiento(req: Request, res: Response) {
        var idTracing = req.params.id;
        var update = req.body;
        try {
            await SeguimientoModel.updateOne({_id: idTracing}, update);
            res.status(200).send({ message: 'Actualizado correctamente ', status: true});
        } catch(e) {
            res.status(500).send({ message: 'Error al actualizar', status: false});
        }
    }

    public async saveSeguimientoOdoo(req: Request, res: Response) {
        let params = req.body;
        let _date2 = (params.date2) ? "'"+params.date2+"'" : null;
        let _send_date = (params.send_date) ? "'"+params.send_date+"'" : null;
        try {
            let _queryFind = `SELECT id, lic_id, lic_det_id, status FROM inventory_tracing
            WHERE lic_id = ${params.lic_id} AND lic_det_id = ${params.lic_det_id} AND status = true`;
            let dataFind = await seqlz.query(_queryFind, { type: seqlz.QueryTypes.SELECT })
            
            if(dataFind) {
                res.status(200).send({ message: 'Ya existe este registro: '+ params.lic_name });
            } else {
                let _query = `INSERT INTO inventory_tracing(
                    lic_id, lic_name, lic_date, lic_det_id, authorized, date2, type, number_solpe, quoted, purchase, received, sent, guide, send_date, urgent, period, area, user_update, date_update, status)
                    VALUES (${params.lic_id}, '${params.lic_name}', '${params.lic_date}', ${params.lic_det_id}, ${params.authorized}, ${_date2}, '${params.type}', '${params.number_solpe}', ${params.quoted}, ${params.purchase}, ${params.received}, ${params.sent}, '${params.guide}', ${_send_date}, ${params.urgent}, '${params.period}', '${params.area}', '${params.user_update}', '${params.date_update}', ${params.status})`;
    
                let result = await seqlz.query(_query, { type: seqlz.QueryTypes.INSERT })
                res.status(200).send({ message: 'Se guardó correctamente: '+ params.lic_name, seguimiento: params });
            }
        } catch(e) {
            res.status(500).send({ message: 'Error al guardar '+params.lic_name, error: e });
        }
    }

    public async updateSeguimientoOdoo(req: Request, res: Response) {
        var idTracing = req.params.id;
        var update = req.body;
        try {
            let _date2 = (update.date2) ? "'"+update.date2+"'" : null;
            let _send_date = (update.send_date) ? "'"+update.send_date+"'" : null;
            let _query = `UPDATE inventory_tracing
                SET lic_id=${update.lic_id}, lic_name=${update.lic_name}, lic_date=${update.lic_date}, lic_det_id=${update.lic_det_id}, authorized=${update.authorized}, date2=${_date2}, type=${update.type}, number_solpe=${update.number_solpe}, quoted=${update.quoted}, purchase=${update.purchase}, received=${update.received}, sent=${update.sent}, guide=${update.guide}, send_date=${_send_date}, urgent=${update.urgent}, period=${update.period}, area=${update.area}, user_update=${update.user_update}, date_update=${update.date_update}, status=${update.status}
                WHERE id = idTracing`;

            let result = await seqlz.query(_query, { type: seqlz.QueryTypes.UPDATE })
            res.status(200).send({ message: 'Actualizado correctamente ', status: true});
        } catch(e) {
            res.status(500).send({ message: 'Error al actualizar', status: false});
        }
    }

    public async getSeguimientoOdoo(req: Request, res: Response) {
        const idLicitacion = req.params.licid;
        const idLicitacionDet = req.params.licdetid;
        const idProduct = req.params.productid;
        try {
            const _product = await AlmacenModel.findOne({product_id: parseInt(idProduct)});

            let _queryTracing = `SELECT * FROM inventory_tracing WHERE lic_id=${idLicitacion} AND lic_det_id=${idLicitacionDet}`;
            let _query = `SELECT lic_det.id AS lic_det_id, lic_det.descripcion, lic.id AS lic_id, lic.number, lic.write_date AS date_approved,
                    per.name AS aprobado, po.name AS po, partner.name AS proveedor, po_line.product_qty AS po_qty, po.date_order
                FROM licitacion_advance_linea AS lic_det
                	INNER JOIN licitacion_advance AS lic ON lic_det.padre = lic.id
                	LEFT JOIN purchase_order_line AS po_line ON lic_det.id = po_line.licitacion_advance_linea_id
                	LEFT JOIN purchase_order AS po ON po_line.order_id = po.id
                	LEFT JOIN res_partner AS partner ON po.partner_id = partner.id
                	LEFT JOIN res_users AS usr ON lic.write_uid = usr.id
                	LEFT JOIN res_partner AS per ON usr.partner_id = per.id
                WHERE lic_det.id = ${idLicitacionDet}`;

            let _tracing = await seqlz.query(_queryTracing,{ type: seqlz.QueryTypes.SELECT, plain: true })
            let detalle = await seqlz.query(_query, { type: seqlz.QueryTypes.SELECT });
            res.status(200).send( {tracing: _tracing, product: _product, detail: detalle} );
        } catch(err) {
            res.status(404).send({ message: 'Error al obtener Seguimiento', error: err });
        }
    }

    public async updateAllSeguimientos(req: Request, res: Response) {
        var seguimientoId = req.params.id;
        var update = req.body;
        try {
            let seguimientoUpdated = await SeguimientoModel.updateMany({},update)
            if (!seguimientoUpdated) {
                res.status(404).send({ message: 'No se ha podido actualizar los seguimientos' });
            } else {
                res.status(200).send({ message: 'Guardado correctamente', seguimientos: seguimientoUpdated });
            }
        } catch(err) {
            res.status(500).send({ message: 'Error al Actualizar seguimientos', error: err });
        }
    }
}
export const seguimientoController = new SeguimientoController();