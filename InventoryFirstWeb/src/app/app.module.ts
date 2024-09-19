import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// PRIME NG
import { DialogModule } from 'primeng/dialog';
import { TreeModule } from 'primeng/tree';
import { CheckboxModule } from 'primeng/checkbox';

// RUTAS
import { APP_ROUTING } from './app.routes';

// SERVICIOS
import { ToastrModule } from 'ngx-toastr';
import { NgxEditorModule } from 'ngx-editor';
import { NgxSpinnerModule } from 'ngx-spinner';

// COMPONENTES
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { ProductoComponent } from './components/producto/producto.component';
import { ProveedorComponent } from './components/proveedor/proveedor.component';
import { RolComponent } from './components/configuracion/rol/rol.component';
import { UsuarioComponent } from './components/configuracion/usuario/usuario.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AlmacenComponent } from './components/almacen/almacen.component';
import { EntradaComponent } from './components/entrada/entrada.component';
import { SalidaComponent } from './components/salida/salida.component';
import { LoginComponent } from './components/login/login.component';
import { MenuComponent } from './components/menu/menu.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ProductoComponent,
    ProveedorComponent,
    RolComponent,
    UsuarioComponent,
    DashboardComponent,
    AlmacenComponent,
    EntradaComponent,
    SalidaComponent,
    LoginComponent,
    MenuComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    NgxEditorModule,
    DialogModule,
    TreeModule,
    CheckboxModule,
    NgxSpinnerModule,
    APP_ROUTING
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
