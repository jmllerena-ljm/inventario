import mongoose, {Schema, model} from 'mongoose';

export interface IAcceso extends mongoose.Document {
    code: String,
    description: String,
    link: String,
    level: Number,
    subLevel: Number,
    index: Number,
    iconName: String,
    status: Boolean
}
const AccesoSchema = new Schema({
    code: String,
    description: String,
    link: String,
    level: Number,
    subLevel: Number,
    index: Number,
    iconName: String,
    status: Boolean
});

export default model<IAcceso>('tblAcceso', AccesoSchema);