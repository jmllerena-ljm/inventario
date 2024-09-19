import { Router } from 'express';
import { entradasController } from '../controllers/Entradas.controller';
import * as md_auth from '../middlewares/authenticated';

const router: Router = Router();

router.get('/get/:identrada', entradasController.getEntrada); // md_auth.ensureAuth,
router.get('/detalle/:id', md_auth.ensureAuth, entradasController.getDetalle);
router.get('/get/detalle/:idproduct/:company', md_auth.ensureAuth, entradasController.getDetalleProducto);
router.post('/search/:count/:page?', md_auth.ensureAuth, entradasController.getEntradas); //corregir
router.post('/save', entradasController.saveEntrada); // md_auth.ensureAuth,
router.post('/reporte/:count/:page?', md_auth.ensureAuth, entradasController.getReporteDetalle);
router.post('/check', entradasController.checkEntrada);
router.put('/detalle/update/:id', entradasController.updateDetalle);
router.put('/update/:id/:code', md_auth.ensureAuth, entradasController.updateEntrada);
router.delete('/delete/:id', entradasController.deleteEntrada);
router.delete('/delete-all/:id', entradasController.deleteAllEntrada);
router.delete('/detalle/delete/:iddetail/:idcompany', md_auth.ensureAuth, entradasController.deleteDetalle);

router.put('/update-all/:id', md_auth.ensureAuth, entradasController.updateAllEntradas); // Ruta de Prueba - Update ALL

router.post('/odoo/search/:count/:page?', md_auth.ensureAuth, entradasController.getOdooEntradas);
router.get('/odoo/detalle/get/:id/:type', entradasController.getOdooDetalleEnt); // md_auth.ensureAuth,
router.post('/odoo/producto/precio', md_auth.ensureAuth, entradasController.getOdooPrecioProducto);
router.post('/odoo/entradas/last', entradasController.getOdooLastMovements);

router.post('/odoo13/entradas/last', entradasController.getOdoo13LastMoves);
router.post('/odoo13/detalle-picking/get', entradasController.getOdoo13DetalleEnt); // md_auth.ensureAuth,

export default router;