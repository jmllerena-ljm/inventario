import {Request, Response} from 'express';
import CompanyModel from '../models/tblCompany';
import moment from 'moment';

class CompanyController {
    public async searchCompanies(req: Request, res: Response) {
        let params = req.body;
        let query_cmp: any = { name : new RegExp(params.name, "i"), }
        if (params.status) query_cmp.status = true;
        const companies = await CompanyModel.find( query_cmp ).sort('index');
        res.status(200).send( companies );
    }
    public async saveCompany(req: Request, res: Response) {
        const company = new CompanyModel();
        let params = req.body;
        company.index = params.index;
        company.ruc = params.ruc;
        company.name = params.name;
        company.code_odoo = params.code_odoo;
        company.short_name = params.short_name;
        company.address = params.address;
        company.phone = params.phone;
        company.ids_moves = params.ids_moves;
        company.user_create = params.user_create;
        company.date_create = new Date(moment().format());
        company.user_update = params.user_create;
        company.date_update = new Date(moment().format());
        company.status = true;
        let companyFind = await CompanyModel.findOne({name: company.name, blnStatus: true});
        if(companyFind) {
            res.status(200).send({ message: 'Ya existe un registro con este nombre: '+ company.name });
        } else {
            company.save((err, companyStored) => {
                if (err) {
                    res.status(500).send({ message: 'Error al guardar '+company.name, error: err });
                } else {
                    if (!companyStored) {
                        res.status(404).send({ message: 'El registro: '+company.name+', no ha sido guardado.' });
                    } else {
                        res.status(200).send({ message: 'Se guardó correctamente: '+ company.name, company: companyStored });
                    }
                }
            });
        }
    }
    public async updateCompany(req: Request, res: Response) {
        var companyId = req.params.id;
        var update = req.body;
        try {
            let companyUpdated = await CompanyModel.findByIdAndUpdate(companyId, update);
            if (!companyUpdated) {
                res.status(404).send({ message: 'No se ha podido actualizar la Compañia' });
            } else {
                res.status(200).send({ message: 'Guardado correctamente', stock: companyUpdated });
            }
        } catch (err) {
            res.status(500).send({ message: 'Error al actualizar Compañia' });
        }
    }
}
export const companyController = new CompanyController();