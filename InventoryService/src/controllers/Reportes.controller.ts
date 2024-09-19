import {Request, Response} from 'express';
import EntradasModel from '../models/tblEntradas';
import EntradaDetModel from '../models/tblEntradaDet';
import CompanyModel from '../models/tblCompany';
import AlmacenModel from '../models/tblAlmacen';
import { seqlz, api_url_odoo, credential_odoo13 } from '../keys';
import axios from 'axios';
import moment from 'moment';
import { tipoCambioController } from './TipoCambio.controller';

export const MONTHS_NAME: string[] = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
class ReportesController {
  // GET PRECIOS PRODUCTO
  public async getOdooPrecioProducto(params: any) {
    try {
      const query = new URLSearchParams();
      query.append('UserName', credential_odoo13.user);
      query.append('Password', credential_odoo13.pass);
      query.append('ProductID', params.product_id);
      query.append('DateIni', params.date_ini);
      query.append('DateFin', params.date_end);
      query.append('CompanyID', params.code_odoo);
      const options = { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      let detail: any = [];
      const response = await axios.post(api_url_odoo+'preciosproductoreport', query, options)
      
      if (response.data.toString() != '') {
        let res_data = response.data.replace(/"/g, '');
        let res_string = (res_data.replace(/'/g, '"')).replace(/None/g, 'null').replace(/(\\x)/gm," ");
        detail = JSON.parse(res_string);
      }
      return detail;
    } catch (err) {
      return [];
    }
  }
  public async getPreciosPromedioMensual(req: Request, res: Response) {
    let { year, productId, company  } = req.body; // { year: 2022, products: [1,3,53,12], company: 1 }
    const _company: any = await CompanyModel.findOne({ _id: company });
    let _tipoCambio = await tipoCambioController.searchTipoCambio({ strFecha: year+'-01-01', tipo: 'anio' });
   
    // const product_id = productId;
    const product = await AlmacenModel.findOne({ product_id: productId });
    let results_month: any = [];
    for (let i = 0; i < MONTHS_NAME.length; i++) {
      const mes = MONTHS_NAME[i];
      let d_ini = moment(new Date(year, i, 1)).format('YYYY-MM-DD');
      let d_end = moment(new Date(year, i+1, 0)).format('YYYY-MM-DD');
      
      let dataPrecios = await reportesController.getOdooPrecioProducto({date_ini: d_ini, date_end: d_end, product_id: productId, code_odoo: _company.code_odoo})
      // let prices = dataPrecios.map((x: any) => x.price_unit);
      let prices = dataPrecios.map((dato: any) => {
        let _pu = dato.price_unit;
        if(dato.currency == 'PEN') {
          let fecha = moment(new Date(dato.date)).format('DD/MM/yyyy');
          let tc = _tipoCambio.Data.find((tc: any) => tc.strFecha == fecha)
          _pu = dato.price_unit / (tc ? tc.fltCompra : 1);
        }
        return _pu;
      });
      const item: any = {
        mont_id: i,
        month_name: mes,
        average: reportesController.getAverage(prices)
      }
      results_month.push(item);
    }
    let result = {
      year: year,
      product_id: productId,
      product_name: (product)? product.name : '',
      product_code: (product)? product.code : '',
      months: results_month
    };
    res.status(200).send({ result });
    
  }
  public getAverage(data: number[]): number {    
    let avg = 0;
    if(data.length > 0) {
      let sum = data.reduce((previous, current) => current += previous);
      avg = sum / data.length;
    }
    return avg;
  }
}


export interface PrecioProductoModel {
  Id: Number;
  name_template: String;
  product_id: Number;
  price_unit: Number;
  date: Date;
  po: String;
  currency: String;
  company_id: Number;
}
export const reportesController = new ReportesController();
