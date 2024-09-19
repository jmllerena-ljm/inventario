import {Request, Response} from 'express';
import moment from 'moment';
import DocsRegisterModel from '../models/tblDocRegister';
import { masterController } from './Master.controller';
import { path_documents } from '../keys';
import fs from 'fs';
import path from 'path';

class DocsRegisterController {
    public async searchDocsRegister(req: Request, res: Response) {
        let itemsPerPage = parseInt(req.params.count);
        let page = (req.params.page) ? (parseInt(req.params.page) - 1) : 0;
        let params = req.body;
        try {
            let query_doc: any = {
                // date : { $gte: "'"+params.date_ini+"'", $lte: "'"+params.date_fin+"'" },
                sender: new RegExp(params.sender, "i"),
                doc_type: new RegExp(params.doc_type, "i"),
                issue: new RegExp(params.issue, "i"),
                reference: new RegExp(params.reference, "i"),
                area: new RegExp(params.area, "i"),
            };
            if (params.date_ini != '' && params.date_fin != '') {
                let _datestart = moment(params.date_ini).format('YYYY-MM-DD')+" 00:00:00.000";
                let _dateend = moment(params.date_fin).add(1, 'days').format('YYYY-MM-DD') + " 00:00:00.000";
                query_doc.date = { $gte: "'"+_datestart+"'", $lte: "'"+_dateend+"'" };
            }
            const registros = await DocsRegisterModel.find( query_doc ).sort({'date': -1})
                .skip(page * itemsPerPage).limit(itemsPerPage);

            const count = await DocsRegisterModel.countDocuments(query_doc);
            res.status(200).send({ Data: registros, Page: registros.length, Count: count });
        } catch(e) {
            res.status(500).send({ message: 'Error al cargar documentos' });
        }
    }
    public async saveDocRegister(req: Request, res: Response) {
        let _code = await masterController.getNextSerie('corr_documento');
        const doc = new DocsRegisterModel();
        let params = req.body;
        doc.code = 'DOC'+_code;
        doc.date =  new Date(moment().format());
        doc.state = 'borrador';
        doc.sender = params.sender;
        doc.doc_type = params.doc_type;
        doc.issue = params.issue;
        doc.reference = params.reference;
        doc.area = params.area;
        doc.observations = params.observations;
        doc.other_data = params.other_data;
        doc.images = '';
        doc.images_path = '';
        doc.create_user = params.create_user;
        doc.create_date = new Date(moment().format());
        doc.update_user = params.create_user;
        doc.update_date = new Date(moment().format());
        doc.status = true;

        doc.save((err, docStored) => {
            if (err) {
                res.status(500).send({ message: 'Error al guardar registro', error: err });
            } else {
                if (!docStored) {
                    res.status(404).send({ message: 'El registro no ha sido guardado.' });
                } else {
                    res.status(200).send({ message: 'Registro Guardado! ', Data: docStored });
                }
            }
        })
    }
    public async updateDocRegister(req: Request, res: Response) {
        var docId = req.params.id;
        var update = req.body;
        // update.date = new Date(moment(update.date).format());
        update.update_date = new Date(moment().format());
        try {
            let docUpdated = await DocsRegisterModel.findByIdAndUpdate(docId, update)
            if (!docUpdated) {
                res.status(404).send({ message: 'No se ha podido actualizar el registro' });
            } else {
                res.status(200).send({ message: 'Registro Actualizado!', Data: docUpdated });
            }
        } catch (err) {
            res.status(500).send({ message: 'Error al actualizar registro' });
        }
    }
    public async approveDocRegister(req: Request, res: Response) {
        var docId = req.params.id;
        try {
            let docUpdated = await DocsRegisterModel.findByIdAndUpdate(docId, { state: 'autorizado', update_date: new Date(moment().format()) });
            if (!docUpdated) {
                res.status(404).send({ message: 'No se ha podido autorizar el documento' });
            } else {
                res.status(200).send({ message: 'Documento Autorizado!', Data: docUpdated });
            }
        } catch (err) {
            res.status(500).send({ message: 'Error al autorizar documento' });
        }
    }
    public async getDocToApprove(req: Request, res: Response) {
        let docId = req.params.id;
        let err = '<div><center><h2>Documento no encontrado!</h2></center></div>';
        try {
            let docFind = await DocsRegisterModel.findById(docId);
            if (docFind) {
                // let confirmation = `<div><center>
                //     <h2>Autorizar el siguiente Documento</h2>
                //     <button style="background-color:#4CAF50;border:none;color: white;padding:10px 20px;margin-bottom:10px" type="button" onclick="myFunction()">Autorizar Documento</button>
                //     <iframe src="http://localhost:3977/api/docs-register/get-document/${docFind?.images_path}" width="95%" height="680px"></iframe>
                // </center></div>`
                // res.status(200).send(confirmation);
                res.sendFile( '../views/confirmation-doc.html')
            } else {
                res.status(200).send(err);
            }
        } catch (e) {
            res.status(200).send(err);
        }
    }
    public async deleteDocRegister(req: Request, res: Response) {
        var docId = req.params.id;
        try {
            let docDeleted = await DocsRegisterModel.remove({ _id: docId },)
            if (!docDeleted) {
                res.status(404).send({ message: 'No se ha podido eliminar el registro' });
            } else {
                res.status(200).send({ message: 'Registro Eliminado!', stock: docDeleted });
            }
        } catch (err) {
            res.status(500).send({ message: 'Error al eliminar registro' });
        }
    }

    public async uploadDocument(req: any, res: Response) {
        let docId = req.params.id;
        try {
            if (req.file) {
                let _file = req.file;
                // if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif') {
                    let updateDoc: any = {
                        images: _file.originalname,
                        images_path: _file.filename
                    }
                    let imageDoc = await DocsRegisterModel.updateOne({ _id: docId }, updateDoc);
                    if (!imageDoc) {
                        res.status(404).send({ message: 'No se ha podido actualizar el usuario' });
                    } else {
                        res.status(200).send({ message: 'Documento subido!', document: updateDoc.images_path, data: imageDoc });
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
    
    public async getDocumentFile(req: Request, res: Response) {
        let imageFile = req.params.docFile;
        let pathFile = path_documents+'documents/' + imageFile
        fs.exists(pathFile, (exists) => {
            if (exists) {
                res.sendFile(path.resolve(pathFile))
            } else {
                res.status(200).send({ message: 'No existe el documento!' });
            }
        })
    }
}
export const docsRegisterController = new DocsRegisterController();