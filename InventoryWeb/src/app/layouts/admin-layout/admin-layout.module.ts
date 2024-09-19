import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from '../../dashboard/dashboard.component';

import { NgxSpinnerModule } from 'ngx-spinner';
import { NgSelectModule } from '@ng-select/ng-select';

import { ReposicionComponent } from '../../views/reposicion/reposicion.component';
import { AlmacenComponent } from '../../views/almacen/almacen.component';
import { EntradaComponent } from '../../views/entrada/entrada.component';
import { ConfiguracionComponent } from '../../views/settings/configuracion.component';
import { ProveedorComponent } from '../../views/proveedor/proveedor.component';
import { RolComponent } from '../../views/configuracion/rol/rol.component';
import { UsuarioComponent } from '../../views/configuracion/usuario/usuario.component';
import { DatosEntradaComponent } from '../../views/entrada/datos-entrada/datos-entrada.component';
import { DetalleEntradaComponent } from '../../views/entrada/detalle-entrada/detalle-entrada.component';
import { CrearEntradaComponent } from '../../views/entrada/crear-entrada/crear-entrada.component';
import { ReporteComponent } from '../../views/reporte/reporte.component';
import { DetalleProductoComponent } from '../../views/entrada/detalle-producto/detalle-producto.component';
import { SeguimientoComponent } from '../../views/seguimiento/seguimiento.component';
import { SeguimientoOdoo13Component } from '../../views/seguimiento-odoo13/seguimiento-odoo13.component';
import { ReciboComponent } from '../../views/recibo/recibo.component';
import { AguaComponent } from '../../views/agua/agua.component';
import { DocsRegisterComponent } from '../../views/docs-register/docs-register.component';
import { FirmaComponent } from '../../views/configuracion/firma/firma.component';
import { IqbfComponent } from '../../views/iqbf/iqbf.component';
import { PrecioPromedioProductoComponent } from '../../views/shared/precio-promedio-producto/precio-promedio-producto.component';
import { PedidosCompraComponent } from '../../views/pedidos-compra/pedidos-compra.component';
import { GuideComponent } from '../../views/guide/guide.component';
import { DetailGuideComponent } from '../../views/guide/detail-guide/detail-guide.component';

// Pipes
import { DateLocalePipe } from '../../pipes/date-locale.pipe';
import { SafeHtmlPipe } from '../../pipes/safe-html.pipe';


// PRIME NG
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { EditorModule } from 'primeng/editor';

import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatTabsModule,
    MatCheckboxModule,
    MatTableModule,
    MatChipsModule,
    DialogModule,
    CalendarModule,
    EditorModule,
    NgxSpinnerModule,
    NgSelectModule
  ],
  declarations: [
    DashboardComponent,
    ReposicionComponent,
    AlmacenComponent,
    EntradaComponent,
    ConfiguracionComponent,
    ProveedorComponent,
    RolComponent,
    UsuarioComponent,
    DetalleEntradaComponent,
    DatosEntradaComponent,
    CrearEntradaComponent,
    ReporteComponent,
    DetalleProductoComponent,
    SeguimientoComponent,
    SeguimientoOdoo13Component,
    ReciboComponent,
    AguaComponent,
    DocsRegisterComponent,
    FirmaComponent,
    IqbfComponent,
    DateLocalePipe,
    PrecioPromedioProductoComponent,
    PedidosCompraComponent,
    GuideComponent,
    DetailGuideComponent,
    SafeHtmlPipe
  ], exports: [
    PrecioPromedioProductoComponent,
    DetailGuideComponent
  ]
})

export class AdminLayoutModule {}
