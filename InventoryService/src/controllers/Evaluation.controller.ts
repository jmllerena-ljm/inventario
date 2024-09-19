import {Request, Response} from 'express';
import moment from 'moment';
import EvaluationModel from '../models/tblEvaluation';
import EvaluationDetailModel from '../models/tblEvaluationDetail';

class EvaluationController {
    public async getEvaluations(req: Request, res: Response) {
        const idLicDet = req.params.idlicdetail;
        const company_id = req.params.company;
        try {
            const evaluations = await EvaluationModel.find({ lic_det_id: parseInt(idLicDet), company: company_id });
            for (let i = 0; i < evaluations.length; i++) {
                let _details = await EvaluationDetailModel.find({ evaluation: evaluations[i]._id });
                evaluations[i].list_detail = JSON.stringify(_details);
            }
            res.status(200).send({ Data: evaluations, Count: evaluations.length });
        } catch (error) {
            res.status(500).send({ message: 'Error al buscar evaluacion de proveedor.', error: error });
        }
    }
    public async saveEvaluations(req: Request, res: Response) {
        const idLicDet = req.params.idlicdetail;
        let registers = req.body;
        try {
            let evalFind = await EvaluationModel.findOne({lic_det_id: parseInt(idLicDet)});
            if(evalFind) {
                await EvaluationModel.remove({ lic_det_id: parseInt(idLicDet) }); // Borrar registros anteriores
                await EvaluationDetailModel.remove({ lic_det_id: parseInt(idLicDet) }); // Borrar detalles anteriores
            }
            for (let idx = 0; idx < registers.length; idx++) {
                const itemEval = registers[idx];
                const evaluation = new EvaluationModel();
                // evaluation.lic_det_id = itemEval.lic_det_id;
                evaluation.company = itemEval.company;
                evaluation.evalution_code = itemEval.evalution_code;
                evaluation.supplier_ruc = itemEval.supplier_ruc;
                evaluation.supplier_name = itemEval.supplier_name;
                // evaluation.qty = itemEval.qty;
                // evaluation.unit_price = itemEval.unit_price;
                // evaluation.total = itemEval.total;
                // evaluation.coin = itemEval.coin;
                evaluation.avg_estimated = itemEval.avg_estimated;
                evaluation.value_estimated = itemEval.value_estimated;
                // evaluation.product_id = itemEval.product_id;
                // evaluation.product_description = itemEval.product_description;
                evaluation.description = itemEval.description;
                evaluation.create_user = itemEval.create_user;
                evaluation.create_date = new Date(moment().format());
                evaluation.status = itemEval.status;
        
                let detalle = itemEval.lista_detalle;
                let evalStored = await evaluation.save(); // Guardar Evaluacion
                /// GUARDAR DETALLES DE LA EVALUACIÓN
                for (let i = 0; i < detalle.length; i++) {
                    const item_detail = new EvaluationDetailModel();
                    // item_detail.lic_det_id = evaluation.lic_det_id;
                    item_detail.code = detalle[i].code;
                    item_detail.name = detalle[i].name;
                    item_detail.description = detalle[i].description;
                    item_detail.type = detalle[i].type;
                    item_detail.value = detalle[i].value;
                    item_detail.status = true;
                    item_detail.evaluation = evalStored._id;
                    await item_detail.save();
                }
            }
            res.status(200).send({ message: 'Se guardo correctamente, evaluación al mejor Proveedor.' });
        } catch(e) {
            res.status(500).send({ message: 'Error en la petición' });
        }
    }
}
export const evaluationController = new EvaluationController();