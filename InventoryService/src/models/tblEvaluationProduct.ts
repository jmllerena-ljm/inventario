import mongoose, {Schema, model} from 'mongoose';
import { IEvaluation } from './tblEvaluation';

export interface IEvaluationProduct extends mongoose.Document {
    lic_det_id: Number,
    product_id: Number,
    product_description: String,
    qty: Number,
    unit_price: Number,
    total: Number,
    coin: String,
    evaluation: IEvaluation['_id'],
}
const EvaluationProductSchema = new Schema({
    lic_det_id: Number,
    product_id: Number,
    product_description: String,
    qty: Number,
    unit_price: Number,
    total: Number,
    coin: String,
    evaluation: { type: Schema.Types.ObjectId, ref: 'tblEvaluation' },
});

export default model<IEvaluationProduct>('tblEvaluationProduct', EvaluationProductSchema);