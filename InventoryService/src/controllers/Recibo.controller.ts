import {Request, Response} from 'express';
import ReciboModel from '../models/tblRecibo';
import { masterController } from './Master.controller';
import moment from 'moment';

class ReciboController {
    public async searchRecibos(req: Request, res: Response) {
        let itemsPerPage = parseInt(req.params.count);
        let page = (req.params.page) ? (parseInt(req.params.page) - 1) : 0;
        let params = req.body;

        let query: any = {
            status: true,
            code : new RegExp(params.code, "i"),
            company : new RegExp(params.company, "i"),
            // date : { $gte: "'"+params.date_ini+"'", $lte: "'"+params.date_fin+"'" }
        }
        // -date
        const recibos = await ReciboModel.find( query ).sort('-date')
            .skip(page*itemsPerPage).limit(itemsPerPage)
        const count = await ReciboModel.countDocuments(query);

        res.status(200).send({ Data: recibos, Page: recibos.length, Count: count });
    }
    public async getRecibo(req: Request, res: Response) {
        const idRecibo = req.params.id;
        try {
            const recibo = await ReciboModel.findOne({ _id: idRecibo })
            .populate({ path: 'firm_authorize', select: 'name type image' })
            .populate({ path: 'firm_request', select: 'name type image' });
            res.status(200).send({ Data: recibo });
        } catch (err) {
            res.status(500).send({ message: 'Error al cargar recibo seleccionado.', error: err });
        }
    }

    public async saveRecibo(req: Request, res: Response) {
        const recibo = new ReciboModel();
        let params = req.body;
        let _code = await masterController.getNextSerie((params.company === 'Asoc.Civil La Joya Esperanza') ? 'corr_esperanza' : 'corr_recibo');
        recibo.state = 'borrador'
        recibo.code = _code;
        recibo.name = params.name;
        recibo.company = params.company;
        recibo.date = new Date(moment().format()),
        recibo.user_request = params.user_request;
        recibo.amount_number = params.amount_number;
        recibo.amount_text = params.amount_text;
        recibo.currency = params.currency;
        recibo.concept = params.concept;
        recibo.account = params.account;
        recibo.operation = params.operation;
        recibo.create_user = params.create_user;
        recibo.status = true;
        // recibo.firm_authorize = params.firm_authorize;
        recibo.firm_request = params.firm_request;

        recibo.save((err, reciboStored) => {
            if (err) {
                res.status(500).send({ message: 'Error al guardar recibo '+recibo.code, error: err });
            } else {
                if (!reciboStored) {
                    res.status(404).send({ message: 'El recibo N° '+recibo.code+', no ha sido guardado.' });
                } else {
                    res.status(200).send({ message: 'Recibo N° '+recibo.code+' guardado correctamente.', recibo: reciboStored });
                }
            }
        })
    }
    public async updateRecibo(req: Request, res: Response) {
        var idRecibo = req.params.idrecibo;
        var update = req.body;
        try {
            let reciboUpdated = await ReciboModel.findByIdAndUpdate(idRecibo, update)
            if (!reciboUpdated) {
                res.status(404).send({ message: 'No se ha podido Autorizar el Recibo' });
            } else {
                res.status(200).send({ message: 'Recibo Autorizado', recibo: reciboUpdated });
            }
        } catch (err) {
            res.status(500).send({ message: 'Error al actualizar Recibo' });
        }
    }
    public async deleteRecibo(req: Request, res: Response) {
        let reciboId = req.params.idrecibo;
        try {
            let reciboDeleted = await ReciboModel.remove({ _id: reciboId });
            if (!reciboDeleted) {
                res.status(404).send({ message: 'No se ha podido eliminar el recibo' });
            } else {
                res.status(200).send({ message: 'Recibo eliminado correctamente', user: reciboDeleted });
            }
        } catch (err) {
            res.status(500).send({ message: 'Error al eliminar recibo' });
        }
    }
}
export const reciboController = new ReciboController();