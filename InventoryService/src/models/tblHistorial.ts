import mongoose, {Schema, model} from 'mongoose';
import { IAlmacen } from './tblAlmacen';

export interface IHistorial extends mongoose.Document {
  date: Date,
  action: String,
  description: String,
  user: String,
  status: Boolean,
  almacen: IAlmacen['_id'],
}
const HistorialSchema = new Schema({
  date: Date,
  action: String,
  description: String,
  user: String,
  status: Boolean,
  almacen: { type: Schema.Types.ObjectId, ref: 'tblAlmacen' },
});

export default model<IHistorial>('tblHistorial', HistorialSchema);