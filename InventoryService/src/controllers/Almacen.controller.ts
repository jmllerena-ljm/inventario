import {Request, Response} from 'express';
import moment from 'moment';
import AlmacenModel from '../models/tblAlmacen';
import HistorialModel from '../models/tblHistorial';
import EntradaDetModel from '../models/tblEntradaDet';
import { historialController } from './Historial.controller';
class AlmacenController {
    public async searchProducts(req: Request, res: Response) {
        let itemsPerPage = parseInt(req.params.count);
        let page = (req.params.page) ? (parseInt(req.params.page) - 1) : 0;
        let params = req.body;
        try {
            let query: any = {
                $or: [
                    { code : new RegExp(params.input, "i") },
                    { name : new RegExp(params.input, "i") },
                ],
                status: true
            };
            const almacen = await AlmacenModel.find(query, 'product_id code name')
                .sort('name').skip(page*itemsPerPage).limit(itemsPerPage);
            const count = await AlmacenModel.countDocuments(query);
            res.status(200).send({ Data: almacen, Page: almacen.length, Count: count });
        } catch (error) {
            res.status(500).send({ message: 'Error al cargar almacen', error: error });
        }
    }
    public async searchAlmacen(req: Request, res: Response) {
        let itemsPerPage = parseInt(req.params.count);
        let page = (req.params.page) ? (parseInt(req.params.page) - 1) : 0;
        let params = req.body;
        try {
            if(params.type == 'replacement') { // Reposiciones, vista Reposiciones
                let query_repos: any = {
                    code : new RegExp(params.code, "i"),
                    name : new RegExp(params.name, "i"),
                    group: new RegExp(params.group, "i"),
                    type: params.type,
                    company: params.company,
                    status: true
                }
                const replacements = await AlmacenModel.find(query_repos).sort(params.sort);

                for(let i = 0; i < replacements.length; i++) {
                    replacements[i].replenish = Number(replacements[i].stock_max) - Number(replacements[i].stock_now);
                    if(replacements[i].stock_now <= replacements[i].stock_security){
                        replacements[i].color = 'red';
                    } else if(replacements[i].stock_now <= replacements[i].stock_min) {
                        replacements[i].color = 'yellow';
                    } else if(replacements[i].stock_now <= replacements[i].stock_max) {
                        replacements[i].color = 'green';
                    } else {
                        replacements[i].color = 'purple';
                    }
                };
                if(params.color != '') {
                    const filter = await replacements.filter(x => x.color == params.color);
                    res.status(200).send({ Data: filter, Total: filter.length });
                } else {
                    res.status(200).send({ Data: replacements, Count: replacements.length });
                }
            } else { // Almacen, vista para almacen
                let query_almacen: any = {
                    code : new RegExp(params.code, "i"),
                    name : new RegExp(params.name, "i"),
                    group: new RegExp(params.group, "i"),
                    company: params.company,
                }

                const almacen = await AlmacenModel.find(query_almacen)
                    .sort(params.sort).skip(page*itemsPerPage).limit(itemsPerPage);
                const count = await AlmacenModel.countDocuments(query_almacen);
                for (let j = 0; j < almacen.length; j++) {
                    const detalle = await EntradaDetModel.find({ product_id: almacen[j].product_id }, 'product_qty type').populate({ path: 'entrada'}).exec();
                    const entradas = detalle.filter(x => (x.type == 'IN' && x.entrada?.company == params.company) );
                    const salidas = detalle.filter(x => (x.type == 'OUT' && x.entrada?.company == params.company));
                    almacen[j].entry = entradas.reduce((prev, cur) => { return prev + Number(cur.product_qty); }, 0);
                    almacen[j].output = salidas.reduce((prev, cur) => { return prev + Number(cur.product_qty); }, 0);
                    console.log(salidas.reduce((prev, cur) => prev + Number(cur.product_qty), 0));
                }
                res.status(200).send({ Data: almacen, Page: almacen.length, Count: count });
            }
        } catch(err) {
            res.status(500).send({ message: 'Error al cargar almacen', error: err });
        }
    }
    public async searchAlmacenIQBF(req: Request, res: Response) {
        let itemsPerPage = parseInt(req.params.count);
        let page = (req.params.page) ? (parseInt(req.params.page) - 1) : 0;
        let params = req.body;
        let query_iqbf: any = {
            code : new RegExp(params.code, "i"),
            name : new RegExp(params.name, "i"),
            group: new RegExp(params.group, "i"),
            audited: true,
            company: params.company,
            status: true
        }
        const almacen = await AlmacenModel.find(query_iqbf)
            .sort(params.sort).skip(page*itemsPerPage).limit(itemsPerPage);
        const count = await AlmacenModel.countDocuments(query_iqbf);
        for (let j = 0; j < almacen.length; j++) {
            const detalle = await EntradaDetModel.find({ product_id: almacen[j].product_id }, 'product_qty type').populate({ path: 'entrada'}).exec();
            const entradas = detalle.filter(x => (x.type == 'IN' && x.entrada.company == params.company && (new Date(x.entrada.date) >= new Date(params.date_ini) && new Date(x.entrada.date) <= new Date(params.date_fin))) );
            const salidas = detalle.filter(x => (x.type == 'OUT' && x.entrada.company == params.company && (new Date(x.entrada.date) >= new Date(params.date_ini) && new Date(x.entrada.date) <= new Date(params.date_fin))) );
            almacen[j].entry = entradas.reduce((prev, cur) => { return prev + Number(cur.product_qty); }, 0);
            almacen[j].output = salidas.reduce((prev, cur) => { return prev + Number(cur.product_qty); }, 0);
        }
        res.status(200).send({ Data: almacen, Page: almacen.length, Count: count, });
    }
    public async getReporteCount(req: Request, res: Response) {
        const almacen = await AlmacenModel.find({type: 'replacement'});
        let _red = 0, _yellow = 0, _green = 0, _purple = 0;
        for(let i = 0; i < almacen.length; i++) {
            if(almacen[i].stock_now <= almacen[i].stock_security) _red += 1;
            else if(almacen[i].stock_now <= almacen[i].stock_min) _yellow += 1;
            else if(almacen[i].stock_now <= almacen[i].stock_max) _green += 1;
            else _purple += 1;
        };
        res.status(200).send({ Data: { red: _red, yellow: _yellow, green: _green, purple: _purple} });
    }

    public async getHistorialChangesAlmacen(req: Request, res: Response) {
        const almacenId = req.params.id;
        try {
            const historial = await HistorialModel.find({ almacen: almacenId }).limit(10).sort('-date');
            res.status(200).send({ Data: historial });
        } catch(e) {
            res.status(500).send({ message: 'Error al cargar Historial', error: e });
        }
    }

    public async saveAlmacen(req: Request, res: Response) {
        const almacen = new AlmacenModel();
        let params = req.body;
        almacen.code = params.code;
        almacen.name = params.name;
        almacen.group = params.group;
        almacen.umed = params.umed;
        almacen.type = params.type;
        almacen.product_id = params.product_id;
        almacen.stock_ini = params.stock_now;
        almacen.stock_security = params.stock_security;
        almacen.stock_min = params.stock_min;
        almacen.stock_max = params.stock_max;
        almacen.stock_now = params.stock_now;
        almacen.update_user = 'system';
        almacen.status = true;
        almacen.company = params.company;

        almacen.save((err, almacenStored) => {
            if (err) {
                res.status(500).send({ message: 'Error al guardar '+almacen.name, error: err });
            } else {
                if (!almacenStored) {
                    res.status(404).send({ message: 'El registro: '+almacen.name+', no ha sido guardado.' });
                } else {
                    res.status(200).send({ message: 'Registro guardado correctamente: '+ almacen.name, almacen: almacenStored });
                }
            }
        })
    }
    public async updateAlmacen(req: Request, res: Response) {
        const almacenId = req.params.id;
        let {sessionUser, ...update} = req.body;
        try {
            update.update_user = sessionUser.strUsuario;
            let almacenUpdated = await AlmacenModel.findByIdAndUpdate(almacenId, update);
            // let almacenUpdated = await AlmacenModel.updateMany({},update)
            if (!almacenUpdated) {
                res.status(404).send({ message: 'No se ha podido actualizar el almacen' });
            } else {
                let resultLog = await historialController.parseElementsAlmacen(update);
                const log = new HistorialModel ({
                    date: new Date(moment().format()),
                    action: 'actualizo',
                    description: resultLog,
                    user: sessionUser.strUsuario,
                    almacen: almacenId
                });
                await log.save();
                res.status(200).send({ message: 'Guardado correctamente', stock: almacenUpdated });
            }
        } catch(err) {
            res.status(500).send({ message: 'Error al Actualizar almacen', error: err });
        }
    }
    public async updateProducto(req: Request, res: Response) {
        var almacenId = req.params.id;
        let update = {
            code: req.body.code,
            stock_ini: req.body.stock_ini,
            stock_now: req.body.stock_now
        }
        let almacenFind = await AlmacenModel.findOne({ product_id: parseInt(almacenId) });
        if(almacenFind) {
            let almacenUpdated = await AlmacenModel.findByIdAndUpdate(almacenFind._id, update);
            res.status(200).send({ message: 'Guardado correctamente', stock: almacenUpdated });
        } else {
            res.status(404).send({ message: 'No se ha podido actualizar el almacen' });
        }
    }
}
export const almacenController = new AlmacenController();
