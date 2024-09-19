import mongoose, {Schema, model} from 'mongoose';

export interface ITipo extends mongoose.Document {
    code: Number,
    name: String,
    text: String,
    status: Boolean
}
const tblTipo = new Schema({
    code: Number,
    name: String,
    text: String,
    status: Boolean
});

export default model<ITipo>('tblTipo', tblTipo);