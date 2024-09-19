import {Request, Response} from 'express';
import MasterModel from '../models/tblMaster';

class MasterController {
    public async getMaster(req: Request, res: Response) {
        const nameMaster = req.params.name;
        const master = await MasterModel.findOne({ strName: nameMaster });
        res.status(200).send( master );
    }

    public async saveMaster(req: Request, res: Response) {
        const master = new MasterModel();
        let params = req.body;
        master.strName = params.strName;
        master.strDescription = params.strDescription;
        master.strValue = params.strValue;
        master.strUpdateDate = params.strUpdateDate;
        master.blnStatus = params.blnStatus;
        let masterFind = await MasterModel.findOne({strName: master.strName, blnStatus: true});
        if(masterFind) {
            res.status(200).send({ message: 'Ya un registro con este nombre: '+ master.strName });
        } else {
            master.save((err, masterStored) => {
                if (err) {
                    res.status(500).send({ message: 'Error al guardar '+master.strName, error: err });
                } else {
                    if (!masterStored) {
                        res.status(404).send({ message: 'El registro: '+master.strName+', no ha sido guardado.' });
                    } else {
                        res.status(200).send({ message: 'Se guardó correctamente: '+ master.strName, master: masterStored });
                    }
                }
            })
        }
    }
    public async updateMaster(req: Request, res: Response) {
        var nameMaster = req.params.name;
        var update = req.body;
        let masterUp = {
            strValue: update.strValue,
            strUpdateDate: update.strUpdateDate
        }
        try {
            await MasterModel.update({strName: nameMaster}, masterUp);
            res.status(200).send({ message: 'Actualizado correctamente ', status: true});
        } catch(e) {
            res.status(500).send({ message: 'Error al actualizar', status: false});
        }
    }
    public async getNextSerie(name: string) {
        let correlativo: string = '';
        const serie = await MasterModel.findOne({ strName: name });
        if(serie) {
            const template = '0000000000';
            let index = Number(serie.strValue);
            correlativo = (template + index).slice(-6);
            await MasterModel.update({_id: serie._id}, {strValue: (index+1).toString() });
            return correlativo;
        } else {
            return '-1';
        }
    }
}
export const masterController = new MasterController();