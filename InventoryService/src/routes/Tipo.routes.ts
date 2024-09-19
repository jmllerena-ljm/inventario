import { Router } from 'express';
import { tipoController } from '../controllers/Tipo.controller';
import * as md_auth from '../middlewares/authenticated';

const router: Router = Router();

router.post('/search', md_auth.ensureAuth, tipoController.searchTipos);
router.post('/save', md_auth.ensureAuth, tipoController.saveTipo);
router.put('/update/:id', md_auth.ensureAuth, tipoController.updateTipo);

export default router;