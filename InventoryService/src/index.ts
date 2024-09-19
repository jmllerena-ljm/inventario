import express from 'express';
import path from 'path';
require("dotenv").config();

// Importing Routes
import AlmacenRoutes from './routes/Almacen.routes';
import EntradasRoutes from './routes/Entradas.routes';
import ProductoRoutes from './routes/Producto.routes';
import ProveedorRoutes from './routes/Proveedor.routes';
import UsuarioRoutes from './routes/Usuario.routes';
import EmailRoutes from './routes/Email.routes';
import MasterRoutes from './routes/Master.routes';
import SeguimientoRoutes from './routes/Seguimiento.routes';
import TipoRoutes from './routes/Tipo.routes';
import EvaluationRoutes from './routes/Evaluation.routes';
import FirmaRoutes from './routes/Firma.routes';
import ReciboRoutes from './routes/Recibo.routes';
import AguaRoutes from './routes/Agua.routes';
import DocsRegisterRoutes from './routes/DocsRegister.routes';
import CompanyRoutes from './routes/Company.routes';
import LotesRoutes from './routes/Lotes.routes';
import PeriodoIqbfRoutes from './routes/PeriodoIqbf.routes';

import Seguimiento13Routes from './routes/Seguimiento13.routes';
import ReportesRoutes from "./routes/Reportes.routes";
import PurchaseOrderRoutes from './routes/PurchaseOrder.routes';
import GuideRoutes from './routes/Guide.routes';
import OdooRoutes from './routes/Odoo.routes';

// Initializations
const app = express();
import './database';

// Settings
app.set('port', process.env.PORT || 3977); 
// 3977 - Inventario
// 3978 - Maxpi

// Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// configurar cabeceras http
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Accept , Content-Type,content-type , Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
})

// Routes
app.get('/', (req, res) => { res.send('Express Service - Inventory') });

// Para no usar # en client
// app.use('/', express.static('client', {redirect: false}));

// app.use(express.static(path.join(__dirname, 'client')));
app.use('/api/almacen', AlmacenRoutes);
app.use('/api/entradas', EntradasRoutes);
app.use('/api/producto', ProductoRoutes);
app.use('/api/proveedor', ProveedorRoutes);
app.use('/api/usuario', UsuarioRoutes);
app.use('/api/email', EmailRoutes);
app.use('/api/master', MasterRoutes);
app.use('/api/seguimiento', SeguimientoRoutes);
app.use('/api/tipo', TipoRoutes);
app.use('/api/evaluation', EvaluationRoutes);
app.use('/api/firma', FirmaRoutes);
app.use('/api/recibo', ReciboRoutes);
app.use('/api/agua', AguaRoutes);
app.use('/api/docs-register', DocsRegisterRoutes);
app.use('/api/company', CompanyRoutes);
app.use('/api/lotes', LotesRoutes);
app.use('/api/periodo-iqbf', PeriodoIqbfRoutes);
app.use('/api/seguimiento13', Seguimiento13Routes);
app.use('/api/reportes', ReportesRoutes);
app.use('/api/purchase-order', PurchaseOrderRoutes);
app.use('/api/guide', GuideRoutes);
app.use('/api/odoo', OdooRoutes);
// Para no usar # en client
// app.get('*', (req, res, next) => {
//     res.sendFile(path.resolve('client/index.html'));
// })

app.listen(app.get('port'), ()=> {
    console.log(`Server on port ${app.get('port')}`);
});
