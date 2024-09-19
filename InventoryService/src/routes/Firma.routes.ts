import { Router } from 'express';
import { firmaController } from '../controllers/Firma.controller';
import * as md_auth from '../middlewares/authenticated';
import { path_documents } from '../keys';

let multer  = require('multer');
let mimetypes = require('mime-types');
let storage = multer.diskStorage({
    destination: path_documents+'firms',
    filename: (req: Request, file: any, cb: any) => {
        cb('', Date.now() + '.' + mimetypes.extension(file.mimetype))
    }
});
var upload = multer({ storage: storage });

const router: Router = Router();

router.post('/search', md_auth.ensureAuth, firmaController.searchFirma);
router.get('/get/:code', md_auth.ensureAuth, firmaController.getFirma);
router.post('/save', md_auth.ensureAuth, firmaController.saveFirma);
router.put('/update/:id', md_auth.ensureAuth, firmaController.updateFirma);
router.post('/upload-image/:id', [md_auth.ensureAuth, upload.single('firm')], firmaController.uploadFirma);
router.get('/get-image/:imageFile', firmaController.getImageFile);

export default router;