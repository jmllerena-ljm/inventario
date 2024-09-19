import { api_url_sig, credential, partner_name } from '../keys';
import axios from 'axios';

export const MONTHS_NAME: string[] = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
class TipoCambioController {
  // GET PRECIOS PRODUCTO
  public async searchTipoCambio(Query: any) {
    try {
      const Data: any = {
        strFecha: Query.strFecha,
        strTipo: Query.tipo
      }
      const options = { headers: { 'Content-Type': 'application/json' } };
      const response = await axios.post(api_url_sig+'tipo-cambio/search?partnerName='+partner_name+'&credential='+credential, Data, options)
      return response.data;
    } catch (err) {
      return [];
    }
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
export const tipoCambioController = new TipoCambioController();
