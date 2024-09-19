import {Request, Response} from 'express';
import axios from 'axios';
import moment from 'moment';
import { api_url_odoo, credential_odoo13, seqlz } from '../keys';
import ProveedorModel from '../models/tblProveedor';
import { masterController } from './Master.controller';

class ProveedorController {
    public async searchProveedores(req: Request, res: Response) {
        let params = req.body;
        let query: any = {
            docNumber: new RegExp(params.number, "i"),
            name : new RegExp(params.name, "i")
        };
        const proveedores = await ProveedorModel.find( query ).sort('name')
        res.status(200).send({ Data: proveedores, Count: proveedores.length });
    }
    public async getProveedor(req: Request, res: Response) {
        let idProveedor = req.params.id;
        try {
            const proveedor = await ProveedorModel.findOne({ _id: idProveedor })
            res.status(200).send({ Data: proveedor });
        } catch (err) {
            res.status(500).send({ message: 'Error al cargar recibo seleccionado.', error: err });
        }
    }
    
    public async saveProveedor(req: Request, res: Response) {
        const proveedor = new ProveedorModel();
        let params = req.body;
        proveedor.typeDoc = params.typeDoc;
        proveedor.docNumber = params.docNumber;
        proveedor.name = params.name.trim().toUpperCase();
        proveedor.email = params.email.trim().toLowerCase();
        proveedor.phone = params.phone;
        proveedor.address = params.address.trim();
        proveedor.type = params.type;
        proveedor.createUser = params.sessionUser.strUsuario;
        proveedor.createDate = new Date(moment().format());
        proveedor.updateUser = params.sessionUser.strUsuario;
        proveedor.updateDate = new Date(moment().format());
        proveedor.status = true;

        let proveedorFind = await ProveedorModel.findOne({ docNumber: proveedor.docNumber });
        if(proveedorFind) {
            let detail_msg = (proveedorFind.status) ? '': ', pero esta deshabilitado!'
            res.status(400).send({ message: `Ya existe un proveedor con este mismo RUC: ${proveedor.docNumber}${detail_msg}` });
        } else {
            let _code = await masterController.getNextSerie('corr_proveedor');
            proveedor.code = 'PR' + _code;
            proveedor.save((err, proveedorStored) => {
                if (err) {
                    res.status(500).send({ message: 'Error al guardar '+proveedor.name, error: err });
                } else {
                    if (!proveedorStored) {
                        res.status(404).send({ message: 'El proveedor: '+proveedor.name+', no ha sido guardado.' });
                    } else {
                        res.status(200).send({ message: 'Se guardó correctamente: '+ proveedor.name, tipo: proveedorStored });
                    }
                }
            })
        }
    }
    public async updateProveedor(req: Request, res: Response) {
        const proveedorId = req.params.id;
        let { _id, code, createUser, createDate, sessionUser, ...update } = req.body;

        update.updateDate = new Date(moment().format());
        update.updateUser = sessionUser.strUsuario;

        try {
            let proveedorUpdated = await ProveedorModel.findByIdAndUpdate(proveedorId, update)
            if (!proveedorUpdated) {
                res.status(404).send({ message: 'No se ha podido actualizar el proveedor' });
            } else {
                res.status(200).send({ message: 'Proveedor actualizado!', stock: proveedorUpdated });
            }
        } catch (err) {
            res.status(500).send({ message: 'Error al actualizar proveedor' });
        }
    }

    public async deleteProveedor(req: Request, res: Response) {
        const proveedorId = req.params.id;
        try {
            const proveedorDeleted = await ProveedorModel.findByIdAndDelete(proveedorId);
            if (!proveedorDeleted) {
                res.status(404).send({ message: 'No se ha podido eliminar el proveedor' });
            } else {
                res.status(200).send({ message: 'Proveedor eliminado correctamente', proveedor: proveedorDeleted });
            }
        } catch (err) {
            res.status(500).send({ message: 'Error al eliminar proveedor' });
        }
    }

    // ODOO 13
    public async getOdoo13Partner(req: Request, res: Response) {
        let idPartner = req.params.id;
        try {
            const params = new URLSearchParams();
            params.append('UserName', credential_odoo13.user);
            params.append('Password', credential_odoo13.pass);
            params.append('ID', idPartner);
            params.append('TypeNumber', '');
            params.append('Name', '');

            const options = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
            
            let partner: any = [];
            axios.post(api_url_odoo+'respartnerreport', params, options)
            .then( response => {
                let _res_string = JSON.stringify(response.data.replace(/'/g, '"')).replace(/None/g, 'null').toLocaleLowerCase();
                partner = JSON.parse(_res_string);
                res.status(200).send( partner );
            })
            .catch( e => {
                res.status(404).send({ message: 'Error al cargar proveedor en odoo 13', error: e });
            });
        } catch (err) {
            res.status(500).send({ message: 'Error Interno - Al cargar proveedor en odoo 13', error: err });
        }
    }
}
export const proveedorController = new ProveedorController();