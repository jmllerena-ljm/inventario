import mongoose, {Schema, model} from 'mongoose';

export interface IProducto extends mongoose.Document {
    strCodigo: String,
    strDescripcion: String,
    strUnitMedida: String,
    strCategoria: String,
    fltStockMin: Number,
    fltStockMax: Number,
    blnConStock: Boolean,
    strUbicacion: String,
    strUsuarioCrea: String,
    dtmFechaCrea: Date,
    strUsuarioModif: String,
    dtmFechaModif: Date,
    chrEstado: String
}
const ProductoSchema = new Schema({
    strCodigo: String,
    strDescripcion: String,
    strUnitMedida: String,
    strCategoria: String,
    fltStockMin: Number,
    fltStockMax: Number,
    blnConStock: Boolean,
    strUbicacion: String,
    strUsuarioCrea: String,
    dtmFechaCrea: Date,
    strUsuarioModif: String,
    dtmFechaModif: Date,
    chrEstado: String
});

export default model<IProducto>('tblProducto', ProductoSchema);