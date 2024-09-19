import mongoose, {Schema, model} from 'mongoose';

export interface IDocRegister extends mongoose.Document {
    code: String,
    date: Date,
    state: String, // Estado <borrador, aprobado, desaprobado, derivado>
    sender: String, // Remitente
    doc_type: String, // Tipo de Documento
    issue: String, // Asunto
    reference: String, // Referencia
    area: String, // Area Distribucion
    observations: String, // Observaciones
    other_data: String, // Otro Dato
    images: String,
    images_path: String,
    create_user: String,
    create_date: Date,
    update_user: String,
    update_date: Date,
    status: Boolean
}
const docRegisterSchema = new Schema({
    code: String,
    date: Date,
    state: String, // Estado <borrador, aprobado, desaprobado, derivado>
    sender: String, // Remitente
    doc_type: String, // Tipo de Documento
    issue: String, // Asunto
    reference: String, // Referencia
    area: String, // Area Distribucion
    observations: String, // Observaciones
    other_data: String, // Otro Dato
    images: String,
    images_path: String,
    create_user: String,
    create_date: Date,
    update_user: String,
    update_date: Date,
    status: Boolean
});

export default model<IDocRegister>('tblDocRegister', docRegisterSchema);