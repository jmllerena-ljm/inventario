import { Router } from 'express';
import { seguimientoController } from '../controllers/Seguimiento.controller';
import * as md_auth from '../middlewares/authenticated';

const router: Router = Router();

router.get('/get/:licid/:licdetid/:productid/:database', seguimientoController.getSeguimiento); // getSeguimientoOdoo
// router.post('/search', seguimientoController.searchSeguimiento);
router.post('/save', md_auth.ensureAuth, seguimientoController.saveSeguimiento); // saveSeguimientoOdoo
router.put('/update/:id', md_auth.ensureAuth, seguimientoController.updateSeguimiento); // updateSeguimientoOdoo
router.post('/reporte', md_auth.ensureAuth, seguimientoController.reporteSeguimiento);
router.post('/reporte/topcompras', md_auth.ensureAuth, seguimientoController.reporteTopCompras);

router.put('/update-all/:id', md_auth.ensureAuth, seguimientoController.updateAllSeguimientos); // Funcion de Prueba - Update All Seguimientos

router.post('/odoo/search/:count/:page?', md_auth.ensureAuth, seguimientoController.searchOdooSeguimiento);
router.post('/odoo/download-fulldata', md_auth.ensureAuth, seguimientoController.downloadOdooSeguimiento);

export default router;