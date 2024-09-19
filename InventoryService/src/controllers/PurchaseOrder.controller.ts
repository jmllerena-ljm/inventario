import {Request, Response} from 'express';
import { api_url_odoo, credential_odoo13 } from '../keys';
import axios from 'axios';

class PurchaseOrderController {
  public async searchPurchaseOrder(req: Request, res: Response) {
    let params = req.body;
    try {
      const query = new URLSearchParams();
      query.append('UserName', credential_odoo13.user);
      query.append('Password', credential_odoo13.pass);
      query.append('ID', '');
      query.append('DateOrderIni', params.date_ini);
      query.append('DateOrderFin', params.date_fin);
      query.append('State', '');
      query.append('Name', params.name);
      query.append('PartnerID', '');

      const options = { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } };
      let orders: any = [];
      axios.post(api_url_odoo+'purchaseorderreport', query, options)
      .then( response => {
        if (response.data.toString() != '') {
          let res_data = response.data.replace(/"/g, '');
          let _res_string = (res_data.replace(/'/g, '"')).replace(/None/g, 'null').replace(/(\\x)/gm," ");
          let parseData = purchaseOrderController.processData(_res_string);
          orders = JSON.parse(parseData);
        }
        res.status(200).send({ Data: orders });
      }).catch( e => {
        res.status(404).send({ message: 'Error al cargar ordenes de compra en odoo 13', error: e });
      });
    } catch (err) {
      res.status(500).send({ message: 'Error Interno - Al cargar ordenes de compra en odoo 13', error: err });
    }
  }

  public async searchDetailPurchaseOrder(req: Request, res: Response) {
    const idOrder = req.params.idorder;
    try {
      const query = new URLSearchParams();
      query.append('UserName', credential_odoo13.user);
      query.append('Password', credential_odoo13.pass);
      query.append('ID', '');
      query.append('OrderID', idOrder);
      query.append('ProductID', '');
      query.append('LicitacionAdvanceLineID', '');
      query.append('State', '');
      query.append('Name', '');

      const options = { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } };
      let details: any = [];
      let response = await axios.post(api_url_odoo+'purchaseorderlinereport', query, options);
      if (response.toString() != '') {
        let res_data = response.data.replace(/"/g, '');
        let _res_string = (res_data.replace(/'/g, '"')).replace(/None/g, 'null').replace(/(\\x)/gm," ").replace(/True/g, 'true');
        let parseData = purchaseOrderController.processData(_res_string);
        details = JSON.parse(parseData);
      }
      
      let results: any = [];
      for (let i = 0; i < details.length; i++) {
        const detail = details[i];
        const product: any = await purchaseOrderController.getProduct(detail.product_id, '', '');
        results.push({
          check_det: false,
          id: detail.id,
          name: detail.name,
          product_id: detail.product_id,
          product_name: (product) ? product.name_template: '',
          product_code: (product) ? product.default_code : '',
          product_qty: detail.product_qty,
          qty_invoiced: detail.qty_invoiced,
          qty_received: detail.qty_received,
          price_unit: detail.price_unit,
          price_subtotal: detail.price_subtotal,
          price_total: detail.price_total,
          price_tax: detail.price_tax,
          order_id: detail.order_id,
          tc_landed: detail.tc_landed,
          licitacion_advance_linea_id: detail.licitacion_advance_linea_id
        });
      }
      res.status(200).send({ Data: results, Count: results.length });
    } catch (err) {
      res.status(500).send({ message: 'Error Interno - Al cargar detalle de la PO en odoo 13', error: err });
    }
  }

  public async getProduct(id: number, code: string, name: string) {
    try {
      const query = new URLSearchParams();
      query.append('UserName', credential_odoo13.user);
      query.append('Password', credential_odoo13.pass);
      query.append('ID', id.toString());
      query.append('DefaultCode', code)
      query.append('NameTemplate', name);

      const options = { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } };
      let product: any = [];
      let response = await axios.post(api_url_odoo+'productproductreport', query, options)
      if (response.toString() != '') {
        let res_data = response.data.replace(/"/g, '');
        let _res_string = (res_data.replace(/'/g, '"')).replace(/None/g, 'null').replace(/(\\x)/gm," ").replace(/True/g, 'true').replace(/False/g, 'false');
        let parseData = purchaseOrderController.processData(_res_string);
        product = JSON.parse(parseData);
      }
      
      return (product.length > 0) ? product[0] : null;
    } catch (err) {
      return null;
    }
  }

  private processData(Data: string): string {
    let reg_exp = /datetime.datetime\(\d+(,\s\d+)+\)/g;
    let _match = Data.match(reg_exp);
    if(_match) {
      for (let i = 0; i < _match.length; i++) {
        const item = _match[i];
        let f_aux = (item.replace(/datetime.datetime/g,'').replace(/(\(|\)|\s)/g, ''));
        let f_aux2 = f_aux.split(',');
        let new_date = `"${f_aux2[0]}-${f_aux2[1].padStart(2, '0')}-${f_aux2[2].padStart(2, '0')}T05:00:00"`;
        Data = Data.replace(item, new_date);
      }
    }
    
    return Data;
  }
}
export const purchaseOrderController = new PurchaseOrderController();