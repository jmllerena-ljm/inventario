import {Request, Response} from 'express';
import moment from 'moment';
import PeriodoIqbfModel from '../models/tblPeriodoIqbf';

class PeriodoIqbfController {
    public async getPeriodoIqbf(req: Request, res: Response) {
        let date_now: any = moment();
        let query: any = {
            dateIni : { $lte: date_now.format('yyyy-MM-DD HH:mm') },
            dateFin : { $gte: date_now.format('yyyy-MM-DD HH:mm') },
        }
        const periodo = await PeriodoIqbfModel.findOne( query ).sort('name')
        res.status(200).send({ Data: periodo });
    }
    public async savePeriodoIqbf(req: Request, res: Response) {
        let params = req.body;
        try {
            const periodo = new PeriodoIqbfModel();
            periodo.name = params.name;
            periodo.dateIni = new Date(moment(params.dateIni).format());
            periodo.dateFin = new Date(moment(params.dateFin).format());
            periodo.status = true;
            periodo.save((err, periodoStored) => {
                if (err) {
                    res.status(500).send({ message: 'Error al guardar periodo', error: err });
                } else {
                    if (!periodoStored) {
                        res.status(404).send({ message: 'El periodo, no ha sido guardado.' });
                    } else {
                        res.status(200).send({ message: 'Periodo guardado correctamente: ', periodo: periodoStored });
                    }
                }
            });
        } catch(err) {
            res.status(500).send({ message: 'Error al guardar Periodo' });
        }
    }
    public async updatePeriodoIqbf(req: Request, res: Response) {
        var periodoId = req.params.id;
        var update = req.body;
        try {
            let periodoUpdated = await PeriodoIqbfModel.findByIdAndUpdate(periodoId, update)
            if (!periodoUpdated) {
                res.status(404).send({ message: 'No se ha podido actualizar el periodo' });
            } else {
                res.status(200).send({ message: 'Guardado correctamente', stock: periodoUpdated });
            }
        } catch (err) {
            res.status(500).send({ message: 'Error al actualizar periodo' });
        }
    }
}
export const periodoIqbfController = new PeriodoIqbfController();