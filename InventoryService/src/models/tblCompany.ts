import mongoose, {Schema, model} from 'mongoose';

export interface ICompany extends mongoose.Document {
    index: String,
    ruc: String,
    name: String,
    code_odoo: Number,
    short_name: String,
    address: String,
    phone: String,
    ids_moves: String,
    connection: String,
    user_create: String,
    date_create: Date,
    user_update: String,
    date_update: Date,
    status: Boolean
}
const tblCompany = new Schema({
    index: String,
    ruc: String,
    name: String,
    code_odoo: Number,
    short_name: String,
    address: String,
    phone: String,
    ids_moves: String,
    connection: String,
    user_create: String,
    date_create: Date,
    user_update: String,
    date_update: Date,
    status: Boolean
});

export default model<ICompany>('tblCompany', tblCompany);