import {Request, Response} from 'express';
import SeguimientoModel from '../models/tblSeguimiento';
import AlmacenModel from '../models/tblAlmacen';
import CompanyModel from '../models/tblCompany';
import { api_url_odoo, credential_odoo13 } from '../keys';
import axios from 'axios';
import moment from 'moment';

class Seguimiento13Controller {

    public async searchOdoo13Seguimiento(req: Request, res: Response) {
        let count = parseInt(req.params.count);
        let page = (req.params.page) ? (parseInt(req.params.page) - 1) : 0;
        const skip = page * count;
        let params = req.body;
        
        try {

            const options = { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } };
            const query_total = new URLSearchParams();
            query_total.append('UserName', credential_odoo13.user);
            query_total.append('Password', credential_odoo13.pass);
            query_total.append('DateIni', params.date_ini);
            query_total.append('DateFin', params.date_fin);
            query_total.append('CompanyID', params.company_id);
            axios.post(api_url_odoo+'cantidadrequerimientosreport', query_total, options)
            .then( totalres => {
                let _res_total = JSON.parse(totalres.data.replace(/'/g, '"'));
                
                count = ((params.lic_name==''&&params.prod_name==''&&params.solicitante=='')
                    &&(params.type!=''|| params.number_solpe!='' || params.guide!=''|| params.con_saldo)) ? _res_total[0].count : count;
                const query = new URLSearchParams();
                query.append('UserName', credential_odoo13.user);
                query.append('Password', credential_odoo13.pass);
                query.append('Number', params.lic_name);
                query.append('State', '');
                query.append('Descripcion', params.prod_name);
                query.append('Empleado', params.solicitante);
                query.append('DateIni', params.date_ini);
                query.append('DateFin', params.date_fin);
                query.append('CompanyID', params.company_id);
                query.append('Limit', count.toString());
                query.append('Offset', skip.toString());
                let tracings: any = [];
                axios.post(api_url_odoo+'seguimientocomprasreport', query, options)
                .then( response => {
                    if (response.data.toString() != '') {
                        let res_data = response.data.replace(/"/g, '');
                        let _res_string = (res_data.replace(/'/g, '"')).replace(/None/g, 'null').replace(/(\\x)/gm," ");
                        tracings = JSON.parse(_res_string);
                    }
                    seguimiento13Controller.processSecom(tracings, params, false).then(process => {
                        res.status(200).send( { Data: process.data, Page: process.data.length, Count: (process.flag == true) ? process.data.length : _res_total[0].count } );
                    });
                })
            })
            
            .catch( e => {
                res.status(404).send({ message: 'Error al cargar seguimiento de compras en odoo 13', error: e });
            });


            // axios.post(api_url_odoo+'seguimientocomprasreport', query, options)
            // .then( response => {
            //     if (response.data.toString() != '') {
            //         let res_data = response.data.replace(/"/g, '');
            //         let _res_string = (res_data.replace(/'/g, '"')).replace(/None/g, 'null').replace(/(\\x)/gm," ");
            //         tracings = JSON.parse(_res_string);
            //     }
            //     const query_total = new URLSearchParams();
            //     query_total.append('UserName', credential_odoo13.user);
            //     query_total.append('Password', credential_odoo13.pass);
            //     query_total.append('DateIni', params.date_ini);
            //     query_total.append('DateFin', params.date_fin);
            //     query_total.append('CompanyID', params.company_id);
            //     axios.post(api_url_odoo+'cantidadrequerimientosreport', query_total, options)
            //     .then( totalres => {
            //         let _res_total = JSON.parse(totalres.data.replace(/'/g, '"'));
            //         seguimiento13Controller.processSecom(tracings, params, false).then(process => {
            //             res.status(200).send( { Data: process.data, Page: process.data.length, Count: (process.flag == true) ? process.data.length : _res_total[0].count } );
            //         });
            //     });

            // }).catch( e => {
            //     res.status(404).send({ message: 'Error al cargar seguimiento de compras en odoo 13', error: e });
            // });
        } catch (err) {
            res.status(500).send({ message: 'Error Interno - Al cargar seguimiento de compras en odoo 13', error: err });
        }
    }

    public async processSecom(tracings: any, params: any, download: boolean) {
        for (let i = 0; i < tracings.length; i++) { 
            let element = await SeguimientoModel.findOne({lic_id: tracings[i].lic_id, lic_det_id: tracings[i].lic_det_id})
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
            tracings[i].company = (element)? element.company : '';
            tracings[i].check_seg = false;
            
            tracings[i].saldo_pedir = tracings[i].cantidad - (tracings[i].po_qty? tracings[i].po_qty : 0);
            tracings[i].check_status = (tracings[i].saldo_pedir <= 0) ? true : false;
        }

        if (download == true) {
            return { data: tracings }
        } else {
            let tracings_saldo = (params.con_saldo) ? tracings.filter((sld: any) => sld.saldo_pedir > 0) : tracings;
    
            if(params.type !== '' || params.number_solpe !== '' || params.guide !== '') {
                let flag = (params.type==='vacio' || params.number_solpe==='vacio' || params.guide==='vacio')? true : false;
                if(flag) {
                    let tracings_vacios: any = [];
                    if(params.type==='vacio') {
                        tracings_vacios = tracings_saldo.filter((item: any) =>  item.type === '');
                    } else if(params.number_solpe=='vacio') {
                        tracings_vacios = tracings_saldo.filter((item: any) =>  item.number_solpe === '');
                    } else {
                        tracings_vacios = tracings_saldo.filter((item: any) =>  item.guide === '');
                    }
                    return {data: tracings_vacios, flag: true };
                } else {
                    let tracing_filter = tracings_saldo.filter((item: any) =>  item.type.toLowerCase().indexOf(params.type.toLowerCase()) > -1
                                                    && item.number_solpe.toLowerCase().indexOf(params.number_solpe.toLowerCase()) > -1
                                                    && item.guide.toLowerCase().indexOf(params.guide.toLowerCase()) > -1);
                    return { data: tracing_filter, flag: true };
                }
            } else {
                return { data: tracings_saldo, flag: false }
            }
        }
    }

    public async downloadOdoo13Seguimiento(req: Request, res: Response) {
        let params = req.body;
        try {
            const query = new URLSearchParams();
            query.append('UserName', credential_odoo13.user);
            query.append('Password', credential_odoo13.pass);
            query.append('Number', '');
            query.append('State', '');
            query.append('Descripcion', '');
            query.append('Empleado', '');
            query.append('DateIni', params.date_ini);
            query.append('DateFin', params.date_fin);
            query.append('CompanyID', params.company_id);
            query.append('Limit', '');
            query.append('Offset', '');

            const options = {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }
            let tracings: any = [];
            axios.post(api_url_odoo+'seguimientocomprasreport', query, options)
            .then( response => {
                if (response.data.toString() != '') {
                    let res_data = response.data.replace(/"/g, '');
                    let _res_string = (res_data.replace(/'/g, '"')).replace(/None/g, 'null').replace(/(\\x)/gm," ");
                    tracings = JSON.parse(_res_string);
                }
                seguimiento13Controller.processSecom(tracings, params, true).then(process => {
                    res.status(200).send( { Data: process.data, Count: process.data.length } );
                });
            }).catch( e => {
                res.status(404).send({ message: 'Error al cargar seguimientos en odoo 13', error: e });
            });
        } catch (err) {
            res.status(500).send({ message: 'Error Interno - Al cargar seguimientos en odoo 13', error: err });
        }
    }

    public async getSeguimientoOdoo13(req: Request, res: Response) {
        const idLicitacion = req.params.licid;
        const idLicitacionDet = req.params.licdetid;
        const idProduct = req.params.productid;
        const id_db = req.params.database;
        try {
            const _company: any = await CompanyModel.findOne({ code_odoo: parseInt(id_db) });
            const _tracing = await SeguimientoModel.findOne({ lic_id: parseInt(idLicitacion), lic_det_id: parseInt(idLicitacionDet), company: _company._id }); // company: _company._id
            const _product = await AlmacenModel.findOne({ product_id: parseInt(idProduct)});

            const query = new URLSearchParams();
            query.append('UserName', credential_odoo13.user);
            query.append('Password', credential_odoo13.pass);
            query.append('ID', idLicitacionDet);
            query.append('CompanyID', id_db);

            const options = {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }
            axios.post(api_url_odoo+'datosaddseguimientoreport', query, options)
            .then( response => {
                let detalle = JSON.parse(response.data.replace(/'/g, '"').replace(/None/g, 'null').replace(/(\\x)/gm," "));
                res.status(200).send( {tracing: _tracing, product: _product, detail: detalle} );
            }).catch( e => {
                res.status(404).send({ message: 'Error al cargar seguimientos en odoo 13', error: e });
            });
        } catch (err) {
            res.status(500).send({ message: 'Error Interno - Al cargar seguimientos en odoo 13', error: err });
        }
    }

    public async reporteSeguimientoOdoo13(req: Request, res: Response) {
        const params = req.body;
        const id_db = params.database;
        // let connection: any = (params.database=='La Joya Concesiones') ? seqlz_conce : seqlz;
        try {
            const _company: any = await CompanyModel.findOne({ code_odoo: parseInt(id_db) });
            let ListRep: any = [];
            let promises = [];
            for (let i = 0; i < params.months.length; i++) {
                const item = params.months[i];
                let df_ini: Date = new Date(moment(item.date_ini + 'T00:00:00').subtract(5, 'hours').format());
                let df_fin: Date = new Date(moment(item.date_fin + 'T00:00:00').subtract(5, 'hours').format());               
 
                // Cotizado
                const quoted_total = await SeguimientoModel.countDocuments({
                    lic_date : { $gte: df_ini, $lte: df_fin },
                    number_solpe: { $ne: '' },
                    company: _company._id
                });
                // Comprado
                const purchase_total = await SeguimientoModel.countDocuments({
                    lic_date : { $gte: df_ini, $lte: df_fin },
                    purchase: { $gte: 100 },
                    company: _company._id
                });
                // Recibido
                const received_total = await SeguimientoModel.countDocuments({
                    lic_date : { $gte: df_ini, $lte: df_fin },
                    received: 100,
                    company: _company._id
                });
                // Atendido
                const send_total = await SeguimientoModel.countDocuments({
                    lic_date : { $gte: df_ini, $lte: df_fin },
                    sent: 100,
                    guide: { $nin: ['anulado', 'ANULADO', 'pendiente'] }, // { $ne: 'anulado',  },
                    company: _company._id
                });

                const options = { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } };
                const query_total = new URLSearchParams();
                query_total.append('UserName', credential_odoo13.user);
                query_total.append('Password', credential_odoo13.pass);
                query_total.append('DateIni', item.date_ini);
                query_total.append('DateFin', item.date_fin);
                query_total.append('CompanyID', id_db);
                
                promises.push(
                    axios.post(api_url_odoo+'cantidadrequerimientosreport', query_total, options)
                    .then( totalres => {
                        let _res_total = JSON.parse(totalres.data.replace(/'/g, '"'));
                        let data_result: any = {
                            id : item.id,
                            name : item.name,
                            count_bidding : _res_total[0].count,
                            quoted_total : quoted_total,
                            purchase_total : purchase_total,
                            received_total : received_total,
                            send_total : send_total,
                        }
                        ListRep.push(data_result);
                    })
                );
            }
            Promise.all(promises).then(() => {
                res.status(200).send( { Datos: ListRep } );
            });
        } catch (err) {
            res.status(404).send({ message: 'Error al cargar grafico', error: err });
        }
    }
    public async reporteTopComprasOdoo13(req: Request, res: Response) {
        const params = req.body;
        try {
            const query = new URLSearchParams();
            query.append('UserName', credential_odoo13.user);
            query.append('Password', credential_odoo13.pass);
            query.append('State', 'aprobado');
            query.append('DateIni', params.date_ini);
            query.append('DateFin', params.date_fin);
            query.append('CompanyID', params.database);
            query.append('Limit', params.limit);

            const options = {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }
            axios.post(api_url_odoo+'topcomprasproductoreport', query, options)
            .then( response => {
                let datos_compras = JSON.parse(response.data.replace(/'/g, '"').replace(/(\\x)/gm," "));
                const query2 = new URLSearchParams();
                query2.append('UserName', credential_odoo13.user);
                query2.append('Password', credential_odoo13.pass);
                query2.append('State', 'aprobado');
                query2.append('DateIni', params.date_ini);
                query2.append('DateFin', params.date_fin);
                query2.append('CompanyID', params.database);
                axios.post(api_url_odoo+'topcomprasareareport', query2, options)
                .then( success => {
                    let datos_areas = JSON.parse(success.data.replace(/'/g, '"').replace(/(\\x)/gm," "));
                    res.status(200).send( { Data: datos_compras, DataArea: datos_areas } );
                }).catch( e => {
                    res.status(404).send({ message: 'Error al cargar Top de Compras / Area en odoo 13', error: e });
                });
            }).catch( e => {
                res.status(404).send({ message: 'Error al cargar Top de Compras / Producto en odoo 13', error: e });
            });
        } catch (err) {
            res.status(404).send({ message: 'Error al cargar Top Compras', error: err });
        }
    }

    public async saveSeguimientoOdoo13(req: Request, res: Response) {
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
        newTracing.guide = (params.guide)? params.guide.trim() : params.guide;
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
    public async updateSeguimientoOdoo13(req: Request, res: Response) {
        let idTracing = req.params.id;
        let update = req.body;
        try {
            await SeguimientoModel.updateOne({_id: idTracing}, update);
            res.status(200).send({ message: 'Actualizado correctamente ', status: true});
        } catch(e) {
            res.status(500).send({ message: 'Error al actualizar', status: false});
        }
    }
    public async updateVariosSeguimientosOdoo13(req: Request, res: Response) {
        let { sessionUser, ids, ...update } = req.body;
        try {
            for (let i = 0; i < ids.length; i++) {
                const item = ids[i];
                const prev_info = await SeguimientoModel.findOne({_id: item});
                let nro_guide: String = '';
                if(prev_info) { nro_guide = prev_info['guide']; }
                let idxOf = nro_guide.indexOf(update.guide)
                if (idxOf == -1) { nro_guide = [nro_guide, update.guide].join(' '); }
                update.guide = nro_guide;
                await SeguimientoModel.updateOne({_id: item}, update);
            }
            res.status(200).send({ message: 'Actualizado correctamente ', status: true});
        } catch(e) {
            res.status(500).send({ message: 'Error al actualizar', status: false});
        }
    }
    public async deleteSeguimientoOdoo13(req: Request, res: Response) {
        let idTracing = req.params.idtracing;
        try {
            let tracingDeleted = await SeguimientoModel.remove({ _id: idTracing });
            if (!tracingDeleted) {
                res.status(404).send({ message: 'No se ha podido eliminar el seguimiento' });
            } else {
                res.status(200).send({ message: 'Seguimiento eliminado correctamente', user: tracingDeleted });
            }
        } catch (err) {
            res.status(500).send({ message: 'Error al eliminar seguimiento' });
        }
    }
}
export const seguimiento13Controller = new Seguimiento13Controller();