import { Router } from 'express';
import { productoController } from '../controllers/Producto.controller';
import * as md_auth from '../middlewares/authenticated';

const router: Router = Router();

// router.get('/:page?', md_auth.ensureAuth, productoController.getProductos);
// router.get('/get/:id', md_auth.ensureAuth, productoController.getProducto);
// router.post('/save', md_auth.ensureAuth, productoController.saveProducto);
// router.put('/update/:id', md_auth.ensureAuth, productoController.updateProducto);
// router.delete('/delete/:id', md_auth.ensureAuth, productoController.deleteProducto);
router.post('/odoo/search/:count/:page?', md_auth.ensureAuth, productoController.getOdooProducts);

export default router;