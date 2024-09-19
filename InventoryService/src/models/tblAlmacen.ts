import mongoose, {Schema, model} from 'mongoose';
import { ICompany } from './tblCompany';


export interface IAlmacen extends mongoose.Document {
    code: String,
    name: String,
    group: String,
    umed: String,
    product_id: Number,
    stock_ini: Number,
    stock_now: Number,
    stock_security: Number,
    stock_min: Number,
    stock_max: Number,
    update_user: String,
    status: Boolean,
    type: String,
    audited: Boolean,
    authorized_amount: Number,

    color: String,
    replenish: Number,
    entry: Number,
    output: Number,
    check: Boolean,
    lic_number: String
    company: ICompany['_id'],
}
const AlmacenSchema = new Schema({
    code: String,
    name: String,
    group: String,
    umed: String,
    product_id: Number,
    stock_ini: Number,
    stock_now: Number, // Stock Actual
    stock_security: Number, // Stock de Seguridad
    stock_min: Number, // Stock Minimo
    stock_max: Number, // Stock Maximo
    update_user: String, // Usuario Actualiza
    status: Boolean, // Estado del Producto
    type: String, // Tipo Reposicion / Almacenable
    audited: Boolean, // Item fiscalizado por Sunat
    authorized_amount: Number, // Cant. Autorizada
    
    color: String, // Color stock
    replenish: Number, // Cantidad a reponer
    entry: Number, // Total entradas
    output: Number, // Total salidas
    check: Boolean, // Check Almacen
    lic_number: String, // Nro Licitacion
    company: { type: Schema.Types.ObjectId, ref: 'tblCompany' },
});

export default model<IAlmacen>('tblAlmacen', AlmacenSchema);