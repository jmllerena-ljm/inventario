import { Router } from 'express';
import { evaluationController } from '../controllers/Evaluation.controller';
import * as md_auth from '../middlewares/authenticated';

const router: Router = Router();

router.get('/search/:idlicdetail/:company', md_auth.ensureAuth, evaluationController.getEvaluations);
router.put('/save/:idlicdetail', md_auth.ensureAuth, evaluationController.saveEvaluations);

export default router;