import { Router } from 'express';
import { usuarioController } from '../controllers/Usuario.controller';
import * as md_auth from '../middlewares/authenticated';

const router: Router = Router();

router.post('/odoo/login', usuarioController.loginOdoo);
router.post('/save', usuarioController.saveUser);
router.post('/search', usuarioController.searchUsers);
router.get('/get/:iduser', usuarioController.getUser);
router.put('/update/:id', md_auth.ensureAuth, usuarioController.updateUser);
router.delete('/delete/:id', md_auth.ensureAuth, usuarioController.deleteUser);

// Accesos
router.get('/acceso/search', md_auth.ensureAuth, usuarioController.searchAccesos);
router.post('/acceso/save', md_auth.ensureAuth, usuarioController.saveAcceso);

export default router;