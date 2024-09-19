import { Router } from 'express';
import { odooController } from '../controllers/Odoo.controller';
import * as md_auth from '../middlewares/authenticated';

const router: Router = Router();

router.get('/stock-picking/:type', odooController.getStockPickingReport);
router.get('/stock-move', odooController.getStockMoveReport);

export default router;