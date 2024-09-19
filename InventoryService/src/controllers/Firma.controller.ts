import {Request, Response} from 'express';
import FirmaModel from '../models/tblFirma';
import { path_documents } from '../keys';
import fs from 'fs';
import path from 'path';

class FirmaController {
    public async searchFirma(req: Request, res: Response) {
        let params = req.body;
        let query_sign: any = {
            name :  new RegExp(params.name, "i"),
            // status: true
        }
        const firmas = await FirmaModel.find(query_sign);
        res.status(200).send({ Data: firmas });
    }
    public async getFirma(req: Request, res: Response) {
        const codeFirma = req.params.code;
        const firma = await FirmaModel.findOne({ code: codeFirma, status: true });
        res.status(200).send({ data: firma });
    }

    public async saveFirma(req: Request, res: Response) {
        const firma = new FirmaModel();
        let params = req.body;
        firma.code = params.code;
        firma.name = params.name;
        firma.type = params.type;
        firma.image = '';
        firma.create_user = params.create_user;
        firma.status = true;
        let firmaFind = await FirmaModel.findOne({code: firma.code, status: true});
        if(firmaFind) {
            res.status(200).send({ message: 'Ya existe una firma con este codigo: '+ firma.code });
        } else {
            firma.save((err, firmaStored) => {
                if (err) {
                    res.status(500).send({ message: 'Error al guardar firma '+firma.name, error: err });
                } else {
                    if (!firmaStored) {
                        res.status(404).send({ message: 'La firma de : '+firma.name+', no ha sido guardada.' });
                    } else {
                        res.status(200).send({ message: 'Se guardó correctamente de: '+ firma.name, firma: firmaStored });
                    }
                }
            })
        }
    }
    public async updateFirma(req: Request, res: Response) {
        var idFirma = req.params.id;
        var update = req.body;
        try {
            await FirmaModel.updateOne({_id: idFirma}, update);
            res.status(200).send({ message: 'Firma actualizada correctamente ', status: true});
        } catch(e) {
            res.status(500).send({ message: 'Error al actualizar', status: false});
        }
    }
    public async uploadFirma(req: any, res: Response) {
        let firmaId = req.params.id;
        try {
            if (req.file) {
                let _file = req.file;
                // if (file_ext == 'png') {
                    let updateFirma: any = {
                        // images: _file.originalname,
                        image: _file.filename
                    }
                    let imageFirma = await FirmaModel.updateOne({ _id: firmaId }, updateFirma);
                    if (!imageFirma) {
                        res.status(404).send({ message: 'No se ha podido actualizar el usuario' });
                    } else {
                        res.status(200).send({ message: 'Firma subida!', firma: updateFirma.image, data: imageFirma });
                    }
                // } else {
                //     res.status(200).send({ message: 'Extension del archivo no valida' });
                // }
            } else {
                res.status(200).send({ message: 'No has subido ninguna imagen...' });
            }
        } catch(e) {
            res.status(500).send({ message: 'Error al subir Imagen!', error: e });
        }
    }
    public async getImageFile(req: Request, res: Response) {
        let imageFile = req.params.imageFile;
        let pathFile = path_documents+'firms/' + imageFile
        fs.exists(pathFile, (exists) => {
            if (exists) {
                res.sendFile(path.resolve(pathFile))
            } else {
                res.status(200).send({ message: 'No existe la imagen' });
            }
        })
    }
}
export const firmaController = new FirmaController();