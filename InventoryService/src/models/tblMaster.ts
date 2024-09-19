import mongoose, {Schema, model} from 'mongoose';

export interface IMaster extends mongoose.Document {
    strName: String,
    strDescription: String,
    strValue: String,
    strUpdateDate: Date,
    blnStatus: Boolean
}
const MasterSchema = new Schema({
    strName: String,
    strDescription: String,
    strValue: String,
    strUpdateDate: Date,
    blnStatus: Boolean
});

export default model<IMaster>('tblMaster', MasterSchema);