import mongoose, {Schema, model} from 'mongoose';
import { IEvaluation } from './tblEvaluation';

export interface IEvaluationDetail extends mongoose.Document {
    lic_det_id: Number,
    code: String,
    name: String,
    description: String,
    type: String,
    value: Number,
    status: Boolean,
    evaluation: IEvaluation['_id'],
}
const EvaluationDetailSchema = new Schema({
    lic_det_id: Number,
    code: String,
    name: String,
    description: String,
    type: String,
    value: Number,
    status: Boolean,
    evaluation: { type: Schema.Types.ObjectId, ref: 'tblEvaluation' },
});

export default model<IEvaluationDetail>('tblEvaluationDetail', EvaluationDetailSchema);