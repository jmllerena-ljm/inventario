import mongoose, {Schema, model} from 'mongoose';

export interface IFirma extends mongoose.Document {
    code: String,
    name: String,
    type: String,
    image: String,
    create_user: String,
    status: Boolean,
}
const FirmaSchema = new Schema({
    code: String,
    name: String,
    type: String,
    image: String,
    create_user: String,
    status: Boolean,
});

export default model<IFirma>('tblFirma', FirmaSchema);