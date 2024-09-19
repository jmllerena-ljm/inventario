import { Router } from 'express';
import { almacenController } from '../controllers/Almacen.controller';
import * as md_auth from '../middlewares/authenticated';

const router: Router = Router();

router.post('/search-products/:count/:page?', md_auth.ensureAuth, almacenController.searchProducts);
router.post('/search/:count/:page?', md_auth.ensureAuth, almacenController.searchAlmacen);
router.post('/search-iqbf/:count/:page?', md_auth.ensureAuth, almacenController.searchAlmacenIQBF);
router.get('/get/historial-changes/:id', md_auth.ensureAuth, almacenController.getHistorialChangesAlmacen);
router.post('/save', almacenController.saveAlmacen);
router.put('/update/:id', md_auth.ensureAuth, almacenController.updateAlmacen);
router.put('/update/producto/:id', almacenController.updateProducto);
router.get('/reporte/stock', md_auth.ensureAuth, almacenController.getReporteCount);

export default router;