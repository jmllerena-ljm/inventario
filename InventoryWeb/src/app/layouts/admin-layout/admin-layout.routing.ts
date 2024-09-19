import { Routes } from '@angular/router';

import { DashboardComponent } from '../../dashboard/dashboard.component';

import { AlmacenComponent } from '../../views/almacen/almacen.component';
import { EntradaComponent } from '../../views/entrada/entrada.component';
import { ConfiguracionComponent } from '../../views/settings/configuracion.component';
import { ProveedorComponent } from '../../views/proveedor/proveedor.component';
import { ReporteComponent } from '../../views/reporte/reporte.component';

import { DetalleEntradaComponent } from '../../views/entrada/detalle-entrada/detalle-entrada.component';
import { DatosEntradaComponent } from '../../views/entrada/datos-entrada/datos-entrada.component';
import { CrearEntradaComponent } from '../../views/entrada/crear-entrada/crear-entrada.component';
import { ReposicionComponent } from '../../views/reposicion/reposicion.component';
import { SeguimientoComponent } from '../../views/seguimiento/seguimiento.component';
import { SeguimientoOdoo13Component } from '../../views/seguimiento-odoo13/seguimiento-odoo13.component';

import { ReciboComponent } from '../../views/recibo/recibo.component';
import { AguaComponent } from '../../views/agua/agua.component';
import { DocsRegisterComponent } from '../../views/docs-register/docs-register.component';
import { FirmaComponent } from '../../views/configuracion/firma/firma.component';
import { UsuarioComponent } from '../../views/configuracion/usuario/usuario.component';
import { IqbfComponent } from '../../views/iqbf/iqbf.component';
import { PedidosCompraComponent } from '../../views/pedidos-compra/pedidos-compra.component';
import { GuideComponent } from '../../views/guide/guide.component';


export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'reposiciones', component: ReposicionComponent },
    { path: 'almacen', component: AlmacenComponent },
    { path: 'movimientos', component: EntradaComponent,
        children: [
            { path: 'datos', component: DatosEntradaComponent },
            { path: 'detalle/:id', component: DetalleEntradaComponent },
            { path: 'crear', component: CrearEntradaComponent },
            { path: '**', pathMatch: 'full', redirectTo: 'datos' }
        ]
    },
    { path: 'configuracion', component: ConfiguracionComponent },
    { path: 'reporte', component: ReporteComponent },
    { path: 'seguimiento', component: SeguimientoComponent },
    { path: 'seguimiento-odoo13', component: SeguimientoOdoo13Component },
    { path: 'recibo', component: ReciboComponent },
    { path: 'agua', component: AguaComponent },
    { path: 'docs-register', component: DocsRegisterComponent },
    { path: 'proveedor', component: ProveedorComponent },
    { path: 'iqbf', component: IqbfComponent },
    { path: 'pedidos-compra', component: PedidosCompraComponent },
    { path: 'guias', component: GuideComponent },
    { path: 'administracion/usuarios', component: UsuarioComponent },
    { path: 'administracion/firmas', component: FirmaComponent },
    { path: '**', pathMatch: 'full', redirectTo: 'dashboard' }
];
