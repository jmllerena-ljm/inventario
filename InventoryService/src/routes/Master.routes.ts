import { Router } from 'express';
import { masterController } from '../controllers/Master.controller';
import * as md_auth from '../middlewares/authenticated';

const router: Router = Router();

router.get('/get/:name', masterController.getMaster);
router.post('/save', masterController.saveMaster);
router.put('/update/:name', masterController.updateMaster);

export default router;