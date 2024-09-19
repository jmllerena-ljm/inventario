import mongoose, {Schema, model} from 'mongoose';

export interface IAgua extends mongoose.Document {
    date: Date,
    guide: String,
    qty: Number,
    supplier_ruc: String,
    supplier_name: String,
    type: String,
    comment: String,
    user_create: String,
    date_create: Date,
    user_update: String,
    date_update: Date,
    status: Boolean
}
const tblAgua = new Schema({
    date: Date,
    guide: String,
    qty: Number,
    supplier_ruc: String,
    supplier_name: String,
    type: String,
    comment: String,
    user_create: String,
    date_create: Date,
    user_update: String,
    date_update: Date,
    status: Boolean
});

export default model<IAgua>('tblAgua', tblAgua);