import { Router } from 'express';
import { proveedorController } from '../controllers/Proveedor.controller';
import * as md_auth from '../middlewares/authenticated';

const router: Router = Router();
// CRUD Mongo
router.post('/search', md_auth.ensureAuth, proveedorController.searchProveedores);
router.get('/get/:id', md_auth.ensureAuth, proveedorController.getProveedor);
router.post('/save', md_auth.ensureAuth, proveedorController.saveProveedor);
router.put('/update/:id', md_auth.ensureAuth, proveedorController.updateProveedor);
router.delete('/delete/:id', md_auth.ensureAuth, proveedorController.deleteProveedor);

// odoo
router.get('/odoo13/get/:id', md_auth.ensureAuth, proveedorController.getOdoo13Partner);

export default router;