import { Router } from 'express';
import { emailController } from '../controllers/Email.controller';
import * as md_auth from '../middlewares/authenticated';

const router: Router = Router();

router.post('/send', md_auth.ensureAuth, emailController.sendMail);

export default router;