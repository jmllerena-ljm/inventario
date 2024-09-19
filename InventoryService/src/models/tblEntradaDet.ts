import mongoose, {Schema, model} from 'mongoose';
import { IEntradas } from './tblEntradas';

export interface IEntradaDet extends mongoose.Document {
    cod: Number,
    ent_id: Number,
    code: String,
    name: String,
    type: String,
    reference: String,
    product_id: Number,
    product_qty: Number,
    price_unit: Number,
    create_user: String,
    date: Date,
    status: Boolean,
    entrada: IEntradas['_id'],
}
const EntradaDetSchema = new Schema({
    cod: Number, // id det Odoo
    ent_id: Number, // id PO / Stock Picking
    code: String, // Codigo producto
    name: String, // Descripcion producto
    type: String, // Tipo IN / OUT
    reference: String,
    product_id: Number, // id Producto
    product_qty: Number, // Cant Producto
    price_unit: Number, // Precio Unit Producto
    create_user: String, // Usuario que creó (Sinva)
    date: Date,
    status: Boolean, // Estado (Sinva)
    entrada: { type: Schema.Types.ObjectId, ref: 'tblEntrada' },
});

export default model<IEntradaDet>('tblEntradaDet', EntradaDetSchema);