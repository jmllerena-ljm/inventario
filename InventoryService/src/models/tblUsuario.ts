import mongoose, {Schema, model} from 'mongoose';

export interface IUsuario extends mongoose.Document {
    code: Number,
    strNombre: String,
    strApellidos: String,
    strEmail: String,
    blnSuperAdmin: Boolean,
    strUsuario: String,
    strPassword: String,
    passEmail: String,
    status: Boolean,
    accessLevel: String,
    rol: String
}
const tblUsuario = new Schema({
    code: Number,
    strNombre: String,
    strApellidos: String,
    strEmail: String,
    blnSuperAdmin: Boolean,
    strUsuario: String,
    strPassword: String,
    passEmail: String,
    status: Boolean,
    accessLevel: String,
    rol: String
});

export default model<IUsuario>('tblUsuario', tblUsuario);