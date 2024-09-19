import { Router } from 'express';
import { reportesController } from '../controllers/Reportes.controller';
import * as md_auth from '../middlewares/authenticated';

const router: Router = Router();

router.post('/search/precios-promedio-producto', md_auth.ensureAuth, reportesController.getPreciosPromedioMensual);

export default router;