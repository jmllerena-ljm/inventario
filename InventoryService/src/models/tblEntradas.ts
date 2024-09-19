import mongoose, {Schema, model} from 'mongoose';
import { ICompany } from './tblCompany';

export interface IEntradas extends mongoose.Document {
    cod: Number,
    name: String,
    type: String,
    origin: String,
    date: Date,
    picking_type_id: Number,
    partner_id: Number,
    po_id: Number,
    status: Boolean,
    create_user: String,
    company: ICompany['_id'],
}
const EntradasSchema = new Schema({
    cod: Number, // id Odoo
    name: String, // Nombre de la Entrada y/o Salida
    type: String, // Tipo Entrada
    origin: String, // Nro de la PO
    date: Date, // Fecha
    picking_type_id: Number, // Id Tipo de Entrada
    partner_id: Number, // Id Proveedor
    po_id: Number, // id PO
    status: Boolean, // Estado
    create_user: String, // Usuario que creó
    company: { type: Schema.Types.ObjectId, ref: 'tblCompany' },
});

export default model<IEntradas>('tblEntrada', EntradasSchema);