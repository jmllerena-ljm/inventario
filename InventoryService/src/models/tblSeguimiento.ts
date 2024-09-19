import mongoose, {Schema, model} from 'mongoose';
import { IAlmacen } from './tblAlmacen';
import { ICompany } from './tblCompany';

export interface ISeguimiento extends mongoose.Document {
    lic_id: Number, // id - Licitacion
    lic_name: String,
    lic_det_id: Number, // id - Detalle Licitacion
    lic_date: Date,
    authorized: Boolean,
    date2: String,
    type: String,
    number_solpe: String,
    quoted: Number, //cotizado
    purchase: Number,
    received: Number,
    // purchase_date: String,
    sent: Number, //enviado
    guide: String,
    send_date: String, //fecha envio
    urgent: Boolean,
    period: String,
    area: String,
    user_update: String,
    date_update: Date,
    status: Boolean,
    // company: String,
    almacen: IAlmacen['_id'],
    company: ICompany['_id'],
}
const SeguimientoSchema = new Schema({
    lic_id: Number, // id - Licitacion
    lic_name: String,
    lic_det_id: Number, // id - Detalle Licitacion
    lic_date: Date,
    authorized: Boolean,
    date2: String, // Fecha de Autorizacion
    type: String,
    number_solpe: String,
    quoted: Number, //cotizado
    purchase: Number,
    received: Number,
    sent: Number, //enviado
    guide: String,
    send_date: String, //fecha envio
    urgent: Boolean,
    period: String,
    area: String,
    user_update: String,
    date_update: Date,
    status: Boolean,
    // company: String,
    almacen: { type: Schema.Types.ObjectId, ref: 'tblAlmacen' },
    company: { type: Schema.Types.ObjectId, ref: 'tblCompany' },
});

export default model<ISeguimiento>('tblSeguimiento', SeguimientoSchema);