import { Router } from 'express';
import { lotesController } from '../controllers/Lotes.controller';
import { path_documents } from '../keys';

let multer  = require('multer');
let mimetypes = require('mime-types');
let storage = multer.diskStorage({
    destination: path_documents+'files-sig',
    filename: (req: Request, file: any, cb: any) => {
        cb('', Date.now() + '.' + mimetypes.extension(file.mimetype))
    }
})
var upload = multer({ storage: storage });

const router: Router = Router();

router.post('/odoo13/lote/save', lotesController.saveLote);
router.post('/odoo13/zona/save', lotesController.saveZona);
router.post('/odoo13/acopiador/save', lotesController.saveAcopiador);
router.post('/odoo13/grupo/search', lotesController.searchGrupo);

router.post('/archivo/upload-file', [upload.single('file')], lotesController.uploadFile);
router.get('/archivo/get-file/:docFile', lotesController.getFile);
router.get('/archivo/process', lotesController.readFile);

router.get('/certificado/get/:idlote/:lote/:idcertificado', lotesController.getCertificadoLote)

export default router;