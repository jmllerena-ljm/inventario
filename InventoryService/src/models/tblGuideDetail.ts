import mongoose, {Schema, model} from 'mongoose';
import { IGuide } from './tblGuide';

export interface IGuideDetail extends mongoose.Document {
  index: Number,
  description: String,
  unit: String,
  qty: Number,
  purchase_order: String,
  number_lic: String,
  lic_det_id: Number,
  id_seg_mongo: String,
  guide: IGuide['_id'],
}
const GuideDetailSchema = new Schema({
  index: Number,
  description: String,
  qty: Number,
  unit: String,
  purchase_order: String,
  number_lic: String,
  lic_det_id: Number,
  id_seg_mongo: String,
  guide: { type: Schema.Types.ObjectId, ref: 'tblGuide' },
});

export default model<IGuideDetail>('tblGuideDetail', GuideDetailSchema);