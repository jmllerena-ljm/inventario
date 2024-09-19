import mongoose, {Schema, model} from 'mongoose';

export interface IEvaluation extends mongoose.Document {
    ids_lic_det: String,
    company: String,
    evalution_code: String,
    supplier_ruc: String,
    supplier_name: String,
    // qty: Number,
    // unit_price: Number,
    // total: Number,
    // coin: String,
    avg_estimated: Number,
    value_estimated: Number,
    // product_id: Number,
    // product_description: String,
    description: String,
    create_user: String,
    create_date: Date,
    status: Boolean,
    list_detail: String
}
const EvaluationSchema = new Schema({
    ids_lic_det: String, // ids Detalle de las Licitaciones
    company: String, // Compañia
    date: Date,
    evalution_code: String, // Codigo de Evaluacion
    supplier_ruc: String, // Proveedor RUC
    supplier_name: String, // Proveedor Razon Social
    // qty: Number, // Cantidad
    // unit_price: Number, // Precio Unitario
    // total: Number, // Monto Total
    // coin: String, // Moneda
    avg_estimated: Number, // Promedio Estimado
    value_estimated: Number, // Valor Estimado con otros proveedores
    // product_id: Number, // id Producto
    // product_description: String, // Descripcion producto
    description: String, // Alguna observacion
    create_user: String, // Usuario Crea
    status: Boolean, // Estado : Activo
    list_detail: String
});

export default model<IEvaluation>('tblEvaluation', EvaluationSchema);