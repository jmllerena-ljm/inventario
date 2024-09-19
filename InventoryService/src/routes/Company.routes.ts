import { Router } from 'express';
import { companyController } from '../controllers/Company.controller';
import * as md_auth from '../middlewares/authenticated';

const router: Router = Router();

router.post('/search', companyController.searchCompanies); // md_auth.ensureAuth
router.post('/save', md_auth.ensureAuth, companyController.saveCompany);
router.put('/update/:id', md_auth.ensureAuth, companyController.updateCompany);

export default router;