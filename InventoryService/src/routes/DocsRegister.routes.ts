import { Router } from 'express';
import { docsRegisterController } from '../controllers/DocsRegister.controller';
import * as md_auth from '../middlewares/authenticated';
import { path_documents } from '../keys';
let multipart = require('connect-multiparty');
let md_upload = multipart({ uploadDir: path_documents+'documents' });

let multer  = require('multer');
let mimetypes = require('mime-types');
let storage = multer.diskStorage({
    destination: path_documents+'documents',
    filename: (req: Request, file: any, cb: any) => {
        cb('', Date.now() + '.' + mimetypes.extension(file.mimetype))
    }
})
var upload = multer({ storage: storage });

const router: Router = Router();

router.post('/search', md_auth.ensureAuth, docsRegisterController.searchDocsRegister);
router.post('/save', md_auth.ensureAuth, docsRegisterController.saveDocRegister);
router.put('/update/:id', md_auth.ensureAuth, docsRegisterController.updateDocRegister);
router.delete('/delete/:id', md_auth.ensureAuth, docsRegisterController.deleteDocRegister);

router.post('/upload-document/:id', [md_auth.ensureAuth, upload.single('document')], docsRegisterController.uploadDocument);
router.get('/get-document/:docFile', docsRegisterController.getDocumentFile);
router.put('/approve-document/:id', docsRegisterController.approveDocRegister);

router.get('/get-to-approve/:id', docsRegisterController.getDocToApprove);

export default router;