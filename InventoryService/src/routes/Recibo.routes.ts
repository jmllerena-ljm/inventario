import { Router } from 'express';
import { reciboController } from '../controllers/Recibo.controller';
import * as md_auth from '../middlewares/authenticated';

const router: Router = Router();

router.post('/search/:count/:page?', md_auth.ensureAuth, reciboController.searchRecibos);
router.get('/get/:id', md_auth.ensureAuth, reciboController.getRecibo);
router.post('/save', md_auth.ensureAuth, reciboController.saveRecibo);
router.put('/update/:idrecibo', md_auth.ensureAuth, reciboController.updateRecibo);
router.delete('/delete/:idrecibo', md_auth.ensureAuth, reciboController.deleteRecibo);

export default router;