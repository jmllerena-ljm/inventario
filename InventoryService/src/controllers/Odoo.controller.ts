import {Request, Response} from 'express';
import FirmaModel from '../models/tblFirma';
import { api_url_odoo, credential_odoo13 } from '../keys';
import axios from 'axios';

class OdooController {
  public async getStockPickingReport(req: Request, res: Response) {
    try {
        const picking_type = req.params.type;

        const params = new URLSearchParams();
        params.append('UserName', credential_odoo13.user);
        params.append('Password', credential_odoo13.pass);
        params.append('ID', '');
        params.append('DateIni', '');
        params.append('DateFin', '');
        params.append('State', '');
        params.append('Name', '');
        params.append('Origin', '');
        params.append('PickingTypeID', picking_type);
        params.append('CompanyID', '');
        params.append('WriteDateIni', '');
        params.append('WriteDateFin', '');
        const options = { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } };
        let moves: any = [];
        axios.post(api_url_odoo+'stockpickingreport', params, options)
        .then( response => {
            if (response.data.length == 0) {
                res.status(200).send( [] );
            } else {
                let res_data = response.data.replace(/"/g, '');
                let _res_string = (res_data.replace(/'/g, '"')).replace(/None/g, 'null').replace(/(\\x)/gm," ").toLocaleLowerCase();
                moves = JSON.parse(_res_string);
                res.status(200).send( moves );
            }
        })
        .catch( e => {
            res.status(404).send({ message: 'Error al obtener Stock Picking de odoo 13', error: e });
        });
    } catch (err) {
        res.status(500).send({ message: 'Error Interno - Al obtener Stock Picking de odoo 13', error: err });
    }
  }

  public async getStockMoveReport(req: Request, res: Response) {
    try {
        const params = new URLSearchParams();
        params.append('UserName', credential_odoo13.user);
        params.append('Password', credential_odoo13.pass);
        params.append('ID', '');
        params.append('DateIni', '');
        params.append('DateFin', '');
        params.append('ProductID', '');
        params.append('PickingID', '');
        params.append('State', '');
        params.append('Name', '');

        const options = { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        let detail: any = [];
        axios.post(api_url_odoo+'stockmovereport', params, options)
        .then( response => {
            if (response.data.length == 0) {
                res.status(200).send( [] );
            } else {
                let res_data = response.data.replace(/"/g, '');
                let _res_string = (res_data.replace(/'/g, '"')).replace(/None/g, 'null').replace(/(\\x)/gm," ").toLocaleLowerCase();
                detail = JSON.parse(_res_string);
                res.status(200).send( detail );
            }
        })
        .catch( e => {
            res.status(404).send({ message: 'Error al obtener Stock Picking de odoo 13', error: e });
        });
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Error Interno - Al obtener Stock Move de odoo 13', error: err });
    }
  }
}
export const odooController = new OdooController();