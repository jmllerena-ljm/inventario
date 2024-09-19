import { Router } from 'express';
import { guideController } from '../controllers/Guide.controller';
import * as md_auth from '../middlewares/authenticated';

const router: Router = Router();
// CRUD Mongo
router.post('/search', md_auth.ensureAuth, guideController.searchGuide);
router.get('/get/:id', md_auth.ensureAuth, guideController.getGuide);
router.post('/save', md_auth.ensureAuth, guideController.saveGuide);
router.put('/update/:id', md_auth.ensureAuth, guideController.updateGuide);

export default router;