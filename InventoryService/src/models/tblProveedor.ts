import mongoose, {Schema, model} from 'mongoose';

export interface IProveedor extends mongoose.Document {
    code: String,
    typeDoc: String,
    docNumber: String,
    name: String,
    email: String,
    phone: String,
    address: String,
    type: String,
    createUser: String,
    createDate: Date,
    updateUser: String,
    updateDate: Date,
    status: Boolean
}
const ProveedorSchema = new Schema({
    code: { type: String, unique: true },
    typeDoc: String,
    docNumber: { type: String, unique: true },
    name: String,
    email: String,
    phone: String,
    address: String,
    type: String,
    createUser: String,
    createDate: Date,
    updateUser: String,
    updateDate: Date,
    status: Boolean
});

export default model<IProveedor>('tblProveedor', ProveedorSchema);