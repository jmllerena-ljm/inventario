import {Request, Response} from 'express';
import EntradasModel from '../models/tblEntradas';
import EntradaDetModel from '../models/tblEntradaDet';
import CompanyModel from '../models/tblCompany';
import AlmacenModel from '../models/tblAlmacen';
import { seqlz, api_url_odoo, credential_odoo13 } from '../keys';
import axios from 'axios';
import moment from 'moment';

class EntradasController {
    public async getEntrada(req: Request, res: Response) {
        const idEntrada = req.params.identrada;
        const detalle = await EntradasModel.findOne({ cod: parseInt(idEntrada) });
        res.status(200).send( detalle );
    }
    public async getEntradas(req: Request, res: Response) {
        let itemsPerPage = parseInt(req.params.count);
        let page = (req.params.page) ? (parseInt(req.params.page) - 1) : 0;
        let params = req.body;
        let query: any = {
            name :  new RegExp(params.name, "i"),
            date : { $gte: "'"+params.date_ini+"'", $lte: "'"+params.date_fin+"'" },
            company : params.company
        }
        const entradas = await EntradasModel.find(query).sort('-date -name')
            .skip(page*itemsPerPage).limit(itemsPerPage);
        const count = await EntradasModel.countDocuments(query);
        res.status(200).send({ Data: entradas, Page: entradas.length, Count: count });
    }
    public async getDetalle(req: Request, res: Response) {
        const idEntrada = req.params.id;
        const entrada = await EntradasModel.findById( idEntrada );
        const detalle = await EntradaDetModel.find({ entrada: idEntrada });
        res.status(200).send({ Entrada: entrada, Detalle: detalle });
    }

    // BUSCAR EN stock_picking ODOO
    public async getOdooEntradas(req: Request, res: Response) {
        let count = parseInt(req.params.count);
        let page = (req.params.page) ? (parseInt(req.params.page) - 1) : 0;
        const skip = page * count;
        let _name = '%'+req.body.name+'%';
        let _dateIni = req.body.date_ini;
        let _dateFin = req.body.date_fin;
        
        let query = '';
        if( _dateIni !== '' && _dateFin !== ''){
            query = "SELECT * FROM stock_picking WHERE (name ILIKE :name OR name ISNULL) AND state IN ('done') AND picking_type_id in (1, 2) AND date >= '"+_dateIni+"' and date <= '"+_dateFin+"' ORDER BY date DESC";
        } else {
            query = "SELECT * FROM stock_picking WHERE (name ILIKE :name OR name ISNULL) AND state IN ('done') AND picking_type_id in (1, 2) ORDER BY date DESC LIMIT :limit OFFSET :offset";
        }
        seqlz.query(query,
        { replacements: { name: _name,
            limit: count, offset: skip}, type: seqlz.QueryTypes.SELECT })
        .then((products: any) => {
            res.status(200).send({ Data: products, Count: products.length })
        }).catch( (err: any) => {
            res.status(500).send({ message: 'Error al buscar entradas en odoo. ', error: err });
        })
    }

    // OBTENER DETALLE DE stock_picking IN/OUT
    public async getOdooDetalleEnt(req: Request, res: Response) {
        let idEntrada = req.params.id;
        let _query = `SELECT stock.id, stock.picking_id, prod.default_code AS code, prod.name_template AS name, stock.product_id, stock.product_uom_qty AS product_qty, stock.price_unit
            FROM stock_move AS stock INNER JOIN
                product_product AS prod ON stock.product_id = prod.id
            WHERE picking_id = ${idEntrada}`;
        seqlz.query(_query, { type: seqlz.QueryTypes.SELECT })
        .then((detalle: any) => {
            res.status(200).send({ Data: detalle, Count: detalle.length })
        }).catch( (err: any) => {
            res.status(500).send({ message: 'Error al cargar detalle de la entrada odoo. ', error: err });
        })
    }
    public async getOdoo13DetalleEnt(req: Request, res: Response) {
        let query = req.body;
        let _fecha_ini = (query.date_ini == '') ? '' : moment( new Date(query.date_ini+'T00:00:00')).format('YYYY/MM/DD HH:mm:ss');
        let _fecha_fin = (query.date_fin == '') ? '' : moment( new Date(query.date_fin+'T00:00:00')).format('YYYY/MM/DD HH:mm:ss');
        try {
            const params = new URLSearchParams();
            params.append('UserName', credential_odoo13.user);
            params.append('Password', credential_odoo13.pass);
            params.append('ID', query.id);
            params.append('DateIni', _fecha_ini);
            params.append('DateFin', _fecha_fin);
            params.append('ProductID', query.product_id);
            params.append('PickingID', query.picking_id);
            params.append('State', query.state);
            params.append('Name', query.name);

            const options = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
            let detail: any = [];
            axios.post(api_url_odoo+'stockmovereport', params, options)
            .then( response => {
                let _res_string = JSON.stringify(response.data.replace(/'/g, '"')).replace(/None/g, 'null');
                detail = JSON.parse(_res_string);
                res.status(200).send( detail );
            })
            .catch( e => {
                res.status(404).send({ message: 'Error al obtener ultimos movimientos en odoo 13', error: e });
            });
            // (data.map(t => t.area_name))
        } catch (err) {
            res.status(500).send({ message: 'Error Interno - Al obtener ultimos movimientos en odoo 13', error: err });
        }
    }

    // GET DATOS ENTRADAS
    public async getHeaderMove(query: any) {
        let _fecha_ini = (query.date_ini == '') ? '' : moment( new Date(query.date_ini+'T00:00:00')).format('YYYY/MM/DD HH:mm:ss');
        let _fecha_fin = (query.date_fin == '') ? '' : moment( new Date(query.date_fin+'T00:00:00')).format('YYYY/MM/DD HH:mm:ss');
        try {
            const params = new URLSearchParams();
            params.append('UserName', credential_odoo13.user);
            params.append('Password', credential_odoo13.pass);
            params.append('ID', query.id);
            params.append('DateIni', _fecha_ini);
            params.append('DateFin', _fecha_fin);
            params.append('State', query.state);
            params.append('Name', query.name);
            params.append('Origin', query.origin);
            params.append('PickingTypeID', query.picking_type_id);
            params.append('CompanyID', query.company_id);
            params.append('WriteDateIni', query.write_date_ini);
            params.append('WriteDateFin', query.write_date_fin);
            const options = { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } };
            let moves: any = [];
            let success = await axios.post(api_url_odoo+'stockpickingreport', params, options);

            if (success.data.length == 0) {
                return { data: [], count: -1, message: 'No se encontro movimiento', status: 404 };
            } else {
                moves = JSON.parse((success.data.replace(/'/g, '"')).replace(/None/g, 'null').toLocaleLowerCase());
                return { data: moves, count: moves.length, status: 200 };
            }
        } catch (err) {
            return { data: [], count: -1, message: 'Error Interno - Al obtener ultimos movimientos en odoo 13', error: err };
        }
    }

    public async getDetailMove(query: any) {
        try {
            const params = new URLSearchParams();
            params.append('UserName', credential_odoo13.user);
            params.append('Password', credential_odoo13.pass);
            params.append('ID', query.id);
            params.append('DateIni', query.date_ini);
            params.append('DateFin', query.date_fin);
            params.append('ProductID', query.product_id);
            params.append('PickingID', query.picking_id);
            params.append('State', query.state);
            params.append('Name', query.name);

            const options = { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
            let detail: any = [];
            let success = await axios.post(api_url_odoo+'stockmovereport', params, options);
            detail = JSON.parse((success.data.replace(/'/g, '"')).replace(/None/g, 'null'));
            return { data: detail, count: detail.length, status: 200 };
        } catch (err) {
            return { data: [], count: -1, message: 'Error Interno - Al obtener detalle del movimiento en odoo 13', error: err, status: 500 };
        }
    }

    // GET PRECIOS PRODUCTO
    public async getOdooPrecioProducto(req: Request, res: Response) {
        let params = req.body;
        try {
            const _company: any = await CompanyModel.findOne({ _id: params.company });

            const query = new URLSearchParams();
            query.append('UserName', credential_odoo13.user);
            query.append('Password', credential_odoo13.pass);
            query.append('ProductID', params.product_id);
            query.append('DateIni', params.date);
            query.append('DateFin', '');
            query.append('CompanyID', _company.code_odoo);

            const options = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
            let detail: any = [];
            axios.post(api_url_odoo+'preciosproductoreport', query, options)
            .then( response => {
                if (response.data.toString() != '') {
                    let _res_string = response.data.replace(/'/g, '"').replace(/None/g, 'null');
                    detail = JSON.parse(_res_string);
                }
                res.status(200).send({ Data: detail, Count: detail.length })
            })
            .catch( e => {
                res.status(404).send({ message: 'Error al cargar Precios del Producto en odoo.', error: e });
            });
        } catch (err) {
            res.status(500).send({ message: 'Error Interno - Error al cargar detalle de la entrada odoo. ', error: err });
        }

    }
    // GET ULTIMOS MOVIMIENTOS
    public async getOdooLastMovements(req: Request, res: Response) {
        let params = req.body;
        let _query = `SELECT * FROM stock_picking
            WHERE date >= '2020-01-01' AND picking_type_id IN (1, 2) AND state IN ('done') AND write_date > '${params.strValue}'
            ORDER BY write_date DESC`;
        seqlz.query(_query, { type: seqlz.QueryTypes.SELECT })
        .then((detalle: any) => {
            res.status(200).send( detalle )
        }).catch( (err: any) => {
            res.status(500).send({ message: 'Error al cargar detalle de la entrada odoo. ', error: err });
        })
    }
    public async getOdoo13LastMoves(req: Request, res: Response) {
        let query = req.body;
        let _fecha_ini = (query.date_ini == '') ? '' : moment( new Date(query.date_ini+'T00:00:00')).format('YYYY/MM/DD HH:mm:ss');
        let _fecha_fin = (query.date_fin == '') ? '' : moment( new Date(query.date_fin+'T00:00:00')).format('YYYY/MM/DD HH:mm:ss');
        try {
            const params = new URLSearchParams();
            params.append('UserName', credential_odoo13.user);
            params.append('Password', credential_odoo13.pass);
            params.append('ID', query.id);
            params.append('DateIni', _fecha_ini);
            params.append('DateFin', _fecha_fin);
            params.append('State', query.state);
            params.append('Name', query.name);
            params.append('Origin', query.origin);
            params.append('PickingTypeID', query.picking_type_id);
            params.append('CompanyID', query.company_id);
            params.append('WriteDateIni', query.write_date_ini);
            params.append('WriteDateFin', query.write_date_fin);
            const options = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
            let moves: any = [];
            axios.post(api_url_odoo+'stockpickingreport', params, options)
            .then( response => {
                if (response.data.length == 0) {
                    res.status(200).send( [] );
                } else {
                    let res_data = response.data.replace(/"/g, '');
                    let _res_string = JSON.stringify(res_data.replace(/'/g, '"')).replace(/None/g, 'null').toLocaleLowerCase();
                    moves = JSON.parse(_res_string);
                    res.status(200).send( moves );
                }
            })
            .catch( e => {
                res.status(404).send({ message: 'Error al obtener ultimos movimientos en odoo 13', error: e });
            });
            // (data.map(t => t.area_name))
        } catch (err) {
            res.status(500).send({ message: 'Error Interno - Al obtener ultimos movimientos en odoo 13', error: err });
        }
    }

    // GET REPORTE
    public async getReporteDetalle(req: Request, res: Response) {
        let itemsPerPage = parseInt(req.params.count);
        let page = (req.params.page) ? (parseInt(req.params.page) - 1) : 0;
        let params = req.body;
        let query_det: any = {
            code:  new RegExp(params.code, "i"),
            name :  new RegExp(params.name, "i"),
        }
        let detalle = await EntradaDetModel.find(query_det).sort('-date').populate({ path: 'entrada', populate: { path: 'company' } })
        .skip(page*itemsPerPage).limit(itemsPerPage);
        const count = await EntradasModel.countDocuments({});
        res.status(200).send({ Data: detalle, Page: detalle.length, Count: count });
    }

    // GET DETALLE POR PRODUCTO
    public async getDetalleProducto(req: Request, res: Response) {
        let idProduct = req.params.idproduct;
        let company = req.params.company;
        try {
            let returnData: any = [];
            let reporte = await EntradaDetModel.find({ product_id : parseInt(idProduct) }).sort('-date')
                .populate({ path: 'entrada' });
            for (let i = 0; i < reporte.length; i++) {
                const element = reporte[i];
                if( element.entrada.company == company ) {
                    returnData.push(element);
                }
            }
            res.status(200).send({ Data: returnData });
        } catch (error) {
            res.status(500).send({ error: error, message: 'Error en la peticion' });
        }
    }

    public async checkEntrada(req: Request, res: Response) {
        let query = req.body;
        try {
            let entradaFind = await EntradasModel.findOne({name: query.name.toUpperCase()});
            if(entradaFind) res.status(200).send( true );
            else res.status(200).send( false );
        } catch (e) {
            res.status(200).send( true );
        }
    }
    
    public async saveEntrada(req: Request, res: Response) {
        let registers = req.body;
        try {
            let MessageStatus: any = [];
            for (let idx = 0; idx < registers.length; idx++) {
                const params = registers[idx];
                // let params = req.body;
                const entrada = new EntradasModel();
                entrada.cod = params.id;
                entrada.name = params.name.toUpperCase();
                entrada.type = params.type.toUpperCase();
                entrada.origin = (params.origin) ? params.origin.toUpperCase() : null;
                entrada.date = params.date;
                entrada.picking_type_id = params.picking_type_id;
                entrada.partner_id = params.partner_id;
                entrada.po_id = params.po_id;
                entrada.status = params.status;
                entrada.create_user = params.create_user;
                entrada.company = params.company;
        
                let detalle = (params.detalle) ? params.detalle : [];
        
                if (entrada.cod != null && entrada.name != null && entrada.date != null) {
                    let entradaFind = await EntradasModel.findOne({name: entrada.name});
                    if (entradaFind) {
                        // res.status(404).send({ message: 'Ya existe una entrada con el mismo nombre: ' + entrada.name });
                        MessageStatus.push({status: false, message: 'Error: Ya existe una entrada con el mismo nombre { name: '+entrada.name+' }'});
                    } else {
                        let entradaStored = await entrada.save();
                        for (let i = 0; i < detalle.length; i++) {
                            const item = new EntradaDetModel();
                            item.entrada = entradaStored._id;
                            item.cod = detalle[i].id;
                            item.ent_id = entrada.cod;
                            item.code = detalle[i].code;
                            item.name = detalle[i].name;
                            item.reference = entrada.name;
                            item.type = entrada.type;
                            item.product_id = detalle[i].product_id;
                            item.product_qty = detalle[i].product_qty;
                            item.price_unit = detalle[i].price_unit;
                            item.create_user = detalle[i].create_user;
                            item.date = entrada.date;
                            item.status = detalle[i].status;
        
                            let almacenFind = await AlmacenModel.findOne({product_id: item.product_id, company: params.company});
                            if(almacenFind) {
                                let newValue: Number = 0;
                                let authorized_value: Number = (almacenFind.authorized_amount) ? almacenFind.authorized_amount : 0;
                                if(entrada.type === "IN") {
                                    newValue = Number(almacenFind.stock_now) + Number(item.product_qty);

                                    // Validar Fiscalizacion
                                    if(almacenFind.audited === true) {
                                        authorized_value = Number(authorized_value) - Number(item.product_qty);
                                    }
                                } else {
                                    newValue = Number(almacenFind.stock_now) - Number(item.product_qty);
                                }
        
                                await AlmacenModel.findByIdAndUpdate(almacenFind._id, {stock_now: newValue, authorized_amount: authorized_value, update_user: 'System'});
                                await item.save();
                                // MessageStatus.push({status: true, message: 'Se actualizó el producto { name: '+almacenFind.name+' }.'});
                            }
                            else {
                                let _value = (entrada.type === "OUT") ? Number(item.product_qty) * -1 : item.product_qty;
        
                                let almacen = new AlmacenModel();
                                almacen.code = item.code
                                almacen.name = item.name;
                                almacen.group = 'Nuevo Producto';
                                almacen.umed = '';
                                almacen.type = 'none'
                                almacen.product_id = item.product_id;
                                almacen.stock_ini = 0;
                                almacen.stock_security = 0;
                                almacen.stock_min = 0;
                                almacen.stock_max = 0;
                                almacen.stock_now = _value;
                                almacen.update_user = item.create_user;
                                almacen.status = true;
                                almacen.company = entrada.company;
                                await almacen.save();
                                await item.save();
                                // MessageStatus.push({status: true, message: 'Producto creado { name: '+item.name+' }'});
                            }
                        }
                        MessageStatus.push({status: true, message: '**Entrada guardada: { name: '+entrada.name+' }'});
                    }
                } else {
                    MessageStatus.push({status: true, message: 'Rellena todos los campos necesarios { name: '+entrada.name+' }'});
                }
                
            }
            
            res.status(200).send({ message: 'Se procesaron todos los registros.', status: MessageStatus });
        } catch(e) {
            res.status(500).send({ message: 'Error en la petición' });
        }
    }
    public async updateEntrada(req: Request, res: Response) {
        let entradaId = req.params.id;
        let entradaCode = req.params.code;
        const query_detail: any = {
            id: entradaCode,
            date_ini: '',
            date_fin: '',
            product_id: '',
            picking_id: '',
            state: '',
            name: '',
        };
        let detail = await entradasController.getDetailMove(query_detail);
        res.status(200).send(detail);

        let detalle_prev = await EntradaDetModel.find({entrada: entradaId});

        if(detalle_prev.length === detail.count) {
            for (let i = 0; i < detalle_prev.length; i++) {
                const itemDetail = detalle_prev[i];
                const itemNewDetail = detail.data.find((x:any) => x.product_id === itemDetail.product_id);

                if(itemDetail.product_qty !== itemNewDetail.product_qty) {
                    let almacenFind = await AlmacenModel.findOne({product_id: detalle_prev[i].product_id});
                    if(almacenFind) {
                        let aux_stock: Number = (itemNewDetail.product_qty) - Number(itemDetail.product_qty);
                        let new_Value = Number(almacenFind.stock_now) + Number(aux_stock);
                        await EntradaDetModel.findByIdAndUpdate(itemDetail._id, {product_qty: itemNewDetail.product_qty});
                        await AlmacenModel.findByIdAndUpdate(almacenFind._id, {stock_now: new_Value});
                    }
                }
            }
            res.status(200).send({ message: 'Movimiento actualizado correctamente.', status: true });
        } else {
            res.status(400).send({ message: 'Error no coincide el detalle del movimiento.', status: false });
        }
    }
    public async deleteEntrada(req: Request, res: Response) {
        let entradaId = req.params.id;
        let cabecera_prev = await EntradasModel.findOne({_id: entradaId});
        let detalle_prev = await EntradaDetModel.find({entrada: entradaId});
        
        await EntradaDetModel.remove({ entrada:entradaId }); // Borrar detalles anteriores
        await EntradasModel.findByIdAndRemove(entradaId); // Borrar entrada

        for (let i = 0; i < detalle_prev.length; i++) {
            const itemDetail = detalle_prev[i];
            let almacenFind = await AlmacenModel.findOne({product_id: itemDetail.product_id, company: cabecera_prev?.company});
            if(almacenFind) {
                let new_value = Number(almacenFind.stock_now);
                let authorized_value = (almacenFind.authorized_amount) ? Number(almacenFind.authorized_amount) : 0;
                if(itemDetail.type==='IN') {
                    new_value -= Number(itemDetail.product_qty);
                    // Validar Fiscalizacion
                    if(almacenFind.audited === true) {
                        authorized_value = authorized_value + Number(itemDetail.product_qty);
                    }
                } else {
                    new_value += Number(itemDetail.product_qty);
                }
                await AlmacenModel.findByIdAndUpdate(almacenFind._id, {stock_now: new_value, authorized_amount: authorized_value});
            }
        }
        res.status(200).send({ message: 'Movimiento anulado correctamente.', detalle: detalle_prev });
    }
    public async deleteAllEntrada(req: Request, res: Response) {
        let entradaId = req.params.id;
        let params = req.body;
        let query: any = {
            date : { $gte: "'"+params.date_ini+"'", $lte: "'"+params.date_fin+"'" }
        }
        const entradas_count = await EntradasModel.deleteMany(query); // await EntradasModel.countDocuments(query);
        const detail_count = await EntradaDetModel.deleteMany(query); // await EntradaDetModel.countDocuments(query);

        res.status(200).send({ message: 'Entradas a eliminar', entradas: entradas_count, detail: detail_count });
    }
    public async updateDetalle(req: Request, res: Response) {
        let detalleId = req.params.id;
        let params = req.body;
        let update = {
            type: params.type,
            reference: params.reference,
        };
        try {
            let detalleUpdated = await EntradaDetModel.findByIdAndUpdate(detalleId, update);
            if (!detalleUpdated) {
                res.status(404).send({ message: 'No se ha podido actualizar el almacen' });
            } else {
                res.status(200).send({ message: 'Guardado correctamente' });
            }
        } catch(err) {
            res.status(500).send({ message: 'Error al actualizar almacen', error: err });
        }
    }
    public async deleteDetalle(req: Request, res: Response) {
        let detalleId = req.params.iddetail;
        // let productId = req.params.idproduct;
        let companyId = req.params.idcompany;
        try {

            const detalle: any = await EntradaDetModel.findOne({ _id: detalleId });
            await EntradaDetModel.remove({ _id: detalleId });
            
            let almacenFind = await AlmacenModel.findOne({ product_id: parseInt(detalle.product_id), company: companyId });
            if(almacenFind) {
                let newValue: Number = 0;
                // newValue = Number(almacenFind.stock_now) - Number(detalle.product_qty);
                if (detalle.type === "IN")    newValue = Number(almacenFind.stock_now) - Number(detalle.product_qty);
                else    newValue = Number(almacenFind.stock_now) + Number(detalle.product_qty);
                
                await AlmacenModel.findByIdAndUpdate(almacenFind._id, {stock_now: newValue, update_user: 'System'});
                res.status(200).send({ message: 'Item Eliminado: '+ detalle.name});
            }
        } catch(err) {
            res.status(500).send({ message: 'Error al eliminar Item', error: err });
        }
    }
    
    // Funcion de Prueba - Para actualizar todas las columnas de la tabla
    public async updateAllEntradas(req: Request, res: Response) {
        var entradaId = req.params.id;
        var update = req.body;
        try {
            let entradaUpdated = await EntradasModel.updateMany({},update)
            if (!entradaUpdated) {
                res.status(404).send({ message: 'No se ha podido actualizar las entradas' });
            } else {
                res.status(200).send({ message: 'Guardado correctamente', entradas: entradaUpdated });
            }
        } catch(err) {
            res.status(500).send({ message: 'Error al Actualizar entradas', error: err });
        }
    }
}
export const entradasController = new EntradasController();
