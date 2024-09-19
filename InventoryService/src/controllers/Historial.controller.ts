// import {Request, Response} from 'express';
// import HistorialModel from '../models/tblHistorial';

class HistorialController {
  private KEYS_ALMACEN = ['code','name','group','umed','product_id','stock_ini','stock_now','stock_security','stock_min','stock_max','update_user','status','type','audited','authorized_amount'];
  private NAMES_ALMACEN = ['Codigo','Nombre','Grupo','UM','ID Producto','S.Ini','S.Actual','S.Seg','S.Min','S.Max','Usuario Modifica','Activo?','Tipo','Fisc?','Monto Aut']

  public async parseElementsAlmacen(Data: any) {
    try {
      let {update_user, ...almacen} = Data;
      let texto = [];
      for (const key in almacen) {
        const idx = this.KEYS_ALMACEN.indexOf(key);
        if (idx >= 0) {
          texto.push(this.NAMES_ALMACEN[idx] + ': ' + Data[key]);
        }
      }
      return texto.join(', ');
    } catch (e) {
      return 'Error al procesar datos modificados!';
    }
  }
}
export const historialController = new HistorialController();