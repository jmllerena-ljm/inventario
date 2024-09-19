import mongoose, {Schema, model} from 'mongoose';
import { IFirma } from './tblFirma';

export interface IRecibo extends mongoose.Document {
    state: String,
    code: String,
    name: String,
    company: String,
    date: Date,
    user_request: String,
    amount_number: Number,
    amount_text: String,
    currency: String,
    concept: String,
    account: String,
    operation: String,
    create_user: String,
    status: Boolean,
    firm_authorize: IFirma['_id'],
    firm_request: IFirma['_id']
}
const ReciboSchema = new Schema({
    state: String,
    code: String,
    name: String,
    company: String,
    date: Date,
    user_request: String,
    amount_number: Number,
    amount_text: String,
    currency: String,
    concept: String,
    account: String,
    operation: String,
    create_user: String,
    status: Boolean,
    firm_authorize: { type: Schema.Types.ObjectId, ref: 'tblFirma' },
    firm_request: { type: Schema.Types.ObjectId, ref: 'tblFirma' }
});

export default model<IRecibo>('tblRecibo', ReciboSchema);