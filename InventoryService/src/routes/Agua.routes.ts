import { Router } from 'express';
import { aguaController } from '../controllers/Agua.controller';
import * as md_auth from '../middlewares/authenticated';

const router: Router = Router();

router.post('/search', md_auth.ensureAuth, aguaController.searchAgua);
router.post('/save', md_auth.ensureAuth, aguaController.saveAgua);
router.put('/update/:id', md_auth.ensureAuth, aguaController.updateAgua);
router.delete('/delete/:id', md_auth.ensureAuth, aguaController.deleteAgua);

export default router;