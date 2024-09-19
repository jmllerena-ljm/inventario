import mongoose, {Schema, model} from 'mongoose';

export interface IPeriodoIqbf extends mongoose.Document {
    name: String,
    dateIni: Date,
    dateFin: Date,
    status: Boolean
}
const PeriodoIqbfSchema = new Schema({
    name: String,
    dateIni: Date,
    dateFin: Date,
    status: Boolean
});

export default model<IPeriodoIqbf>('tblPeriodoIqbf', PeriodoIqbfSchema);