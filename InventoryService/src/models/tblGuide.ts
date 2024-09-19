import mongoose, {Schema, model} from 'mongoose';
import { ICompany } from './tblCompany';

export interface IGuide extends mongoose.Document {    
  number_guide: String, // Nro Guia
  arrival_point: String, // Punto de Llegada
  carrier_name: String, // Transportista
  carrier_ruc: String, // Transportista RUC
  constancy_ins: String, // Constancia de inscripcion
  date: Date, // Fecha
  doc_identify: String, // RUC Emp. Salida
  license_number: String, // Nro de Licencia
  number_invoice: String, // Nro de Factura
  plate_number: String, // Nro Placa
  receiver: String, // Destinatario
  starting_point: String, // Punto de Partida
  vehicle_mark: String, // Marca del Vehiculo
  description: String,
  create_user: String,
  create_date: Date,
  update_user: String,
  update_date: Date,
  status: Boolean,
  company: ICompany['_id'],
}
const GuideSchema = new Schema({
  number_guide: String, // Nro Guia
  arrival_point: String, // Punto de Llegada
  carrier_name: String, // Transportista
  carrier_ruc: String, // Transportista RUC
  constancy_ins: String, // Constancia de inscripcion
  date: Date, // Fecha
  doc_identify: String, // RUC Emp. Salida
  license_number: String, // Nro de Licencia
  number_invoice: String, // Nro de Factura
  plate_number: String, // Nro Placa
  receiver: String, // Destinatario
  starting_point: String, // Punto de Partida
  vehicle_mark: String, // Marca del Vehiculo
  description: String,
  create_user: String,
  create_date: Date,
  update_user: String,
  update_date: Date,
  status: Boolean,
  company: { type: Schema.Types.ObjectId, ref: 'tblCompany' },
});

export default model<IGuide>('tblGuide', GuideSchema);