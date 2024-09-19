import {Request, Response} from 'express';
import TipoModel from '../models/tblTipo';

class TipoController {
    public async searchTipos(req: Request, res: Response) {
        let params = req.body;
        let query_tipo: any = { name : new RegExp(params.name, "i"), }
        const tipos = await TipoModel.find( query_tipo ).sort('name')
        res.status(200).send({ Data: tipos, Count: tipos.length });
    }
    public async saveTipo(req: Request, res: Response) {
        const tipo = new TipoModel();
        let params = req.body;
        tipo.code = params.code;
        tipo.name = params.name;
        tipo.text = params.text;
        tipo.status = true;
        let tipoFind = await TipoModel.findOne({name: tipo.name, text: tipo.text, blnStatus: true});
        if(tipoFind) {
            res.status(200).send({ message: 'Ya existe un registro con este nombre: '+ tipo.name });
        } else {
            tipo.save((err, tipoStored) => {
                if (err) {
                    res.status(500).send({ message: 'Error al guardar '+tipo.name, error: err });
                } else {
                    if (!tipoStored) {
                        res.status(404).send({ message: 'El registro: '+tipo.name+', no ha sido guardado.' });
                    } else {
                        res.status(200).send({ message: 'Se guardó correctamente: '+ tipo.name, tipo: tipoStored });
                    }
                }
            })
        }
    }
    public async updateTipo(req: Request, res: Response) {
        var tipoId = req.params.id;
        var update = req.body;
        try {
            let tipoUpdated = await TipoModel.findByIdAndUpdate(tipoId, update)
            if (!tipoUpdated) {
                res.status(404).send({ message: 'No se ha podido actualizar el tipo' });
            } else {
                res.status(200).send({ message: 'Guardado correctamente', stock: tipoUpdated });
            }
        } catch (err) {
            res.status(500).send({ message: 'Error al actualizar tipo' });
        }
    }
}
export const tipoController = new TipoController();