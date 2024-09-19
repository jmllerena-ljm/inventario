import {Request, Response} from 'express';
import moment from 'moment';
import AguaModel from '../models/tblAgua';

class AguaController {
    public async searchAgua(req: Request, res: Response) {
        let params = req.body;
        let query_tipo: any = { 
            date : { $gte: "'"+params.date_ini+"'", $lte: "'"+params.date_fin+"'" },
            guide: new RegExp(params.guide, "i"),
            type: new RegExp(params.type, "i"),
            supplier_name: new RegExp(params.supplier, "i"),
        };
        const registros = await AguaModel.find( query_tipo ).sort({'date': -1});

        res.status(200).send({ Data: registros, Count: registros.length });
    }
    public async saveAgua(req: Request, res: Response) {
        const agua = new AguaModel();
        let params = req.body;
        agua.date =  new Date(moment(params.date).format());
        agua.guide = params.guide;
        agua.qty = params.qty;
        agua.supplier_ruc = params.supplier_ruc;
        agua.supplier_name = params.supplier_name;
        agua.type = params.type;
        agua.comment = params.comment;
        agua.user_create = params.user_create;
        agua.date_create = new Date(moment().format());
        agua.user_update = params.user_create;
        agua.date_update = new Date(moment().format());
        agua.status = true;

        agua.save((err, aguaStored) => {
            if (err) {
                res.status(500).send({ message: 'Error al guardar registro', error: err });
            } else {
                if (!aguaStored) {
                    res.status(404).send({ message: 'El registro no ha sido guardado.' });
                } else {
                    res.status(200).send({ message: 'Se guardó correctamente ', tipo: aguaStored });
                }
            }
        })
    }
    public async updateAgua(req: Request, res: Response) {
        var aguaId = req.params.id;
        var update = req.body;
        update.date = new Date(moment(update.date).format());
        update.date_update = new Date(moment().format());
        try {
            let aguaUpdated = await AguaModel.findByIdAndUpdate(aguaId, update)
            if (!aguaUpdated) {
                res.status(404).send({ message: 'No se ha podido actualizar el registro' });
            } else {
                res.status(200).send({ message: 'Guardado correctamente', stock: aguaUpdated });
            }
        } catch (err) {
            res.status(500).send({ message: 'Error al actualizar registro' });
        }
    }
    public async deleteAgua(req: Request, res: Response) {
        var aguaId = req.params.id;
        try {
            let aguaDeleted = await AguaModel.remove({ _id: aguaId },)
            if (!aguaDeleted) {
                res.status(404).send({ message: 'No se ha podido eliminar el registro' });
            } else {
                res.status(200).send({ message: 'Registro Eliminado!', stock: aguaDeleted });
            }
        } catch (err) {
            res.status(500).send({ message: 'Error al eliminar registro' });
        }
    }
}
export const aguaController = new AguaController();