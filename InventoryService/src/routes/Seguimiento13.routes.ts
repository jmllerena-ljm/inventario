import { Router } from 'express';
import { seguimiento13Controller } from '../controllers/Seguimiento13.controller';
import * as md_auth from '../middlewares/authenticated';

const router: Router = Router();

router.post('/save', md_auth.ensureAuth, seguimiento13Controller.saveSeguimientoOdoo13); // saveSeguimientoOdoo
router.put('/update/:id', md_auth.ensureAuth, seguimiento13Controller.updateSeguimientoOdoo13); // updateSeguimientoOdoo
router.post('/update-varios', md_auth.ensureAuth, seguimiento13Controller.updateVariosSeguimientosOdoo13);
router.delete('/delete/:idtracing', md_auth.ensureAuth, seguimiento13Controller.deleteSeguimientoOdoo13);

router.post('/reporte', md_auth.ensureAuth, seguimiento13Controller.reporteSeguimientoOdoo13);
router.post('/reporte/topcompras', md_auth.ensureAuth, seguimiento13Controller.reporteTopComprasOdoo13);


router.post('/odoo/search/:count/:page?', md_auth.ensureAuth, seguimiento13Controller.searchOdoo13Seguimiento);
router.post('/odoo/download-fulldata', md_auth.ensureAuth, seguimiento13Controller.downloadOdoo13Seguimiento);
router.get('/get/:licid/:licdetid/:productid/:database', seguimiento13Controller.getSeguimientoOdoo13); // getSeguimientoOdoo

export default router;