import mongoose, {Schema, model} from 'mongoose';
import { IProducto } from './tblProducto';
import { IProveedor } from './tblProveedor';

export interface IProveedorProd extends mongoose.Document {
    producto: IProducto['_id'],
    proveedor: IProveedor['_id'],
}
const ProveedorProdSchema = new Schema({
    producto: { type: Schema.Types.ObjectId, ref: 'tblProducto' },
    proveedor: { type: Schema.Types.ObjectId, ref: 'tblProveedor' },
});

export default model<IProveedorProd>('tblProveedorProd', ProveedorProdSchema);