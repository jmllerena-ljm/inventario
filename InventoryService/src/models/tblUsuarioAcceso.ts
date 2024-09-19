import mongoose, {Schema, model} from 'mongoose';
import { IAcceso } from './tblAcceso';
import { IUsuario } from './tblUsuario';

export interface IUsuarioAcceso extends mongoose.Document {
    accessLevel: Boolean,
    acceso: IAcceso['_id'],
    usuario: IUsuario['_id'],
}
const UsuarioAccesoSchema = new Schema({
    accessLevel: Boolean,
    acceso: { type: Schema.Types.ObjectId, ref: 'tblAcceso' },
    usuario: { type: Schema.Types.ObjectId, ref: 'tblUsuario' },
});

export default model<IUsuarioAcceso>('tblUsuarioAcceso', UsuarioAccesoSchema);