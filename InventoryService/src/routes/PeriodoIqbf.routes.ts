import { Router } from 'express';
import { periodoIqbfController } from '../controllers/PeriodoIqbf.controller';
import * as md_auth from '../middlewares/authenticated';

const router: Router = Router();

router.get('/get', md_auth.ensureAuth, periodoIqbfController.getPeriodoIqbf);
router.post('/save', md_auth.ensureAuth, periodoIqbfController.savePeriodoIqbf);
router.put('/update/:id', md_auth.ensureAuth, periodoIqbfController.updatePeriodoIqbf);

export default router;