import { Router } from 'express';
import { purchaseOrderController } from '../controllers/PurchaseOrder.controller';
import * as md_auth from '../middlewares/authenticated';

const router: Router = Router();

router.post('/compras', md_auth.ensureAuth, purchaseOrderController.searchPurchaseOrder);
router.get('/compras-detalle/:idorder', md_auth.ensureAuth, purchaseOrderController.searchDetailPurchaseOrder);

export default router;