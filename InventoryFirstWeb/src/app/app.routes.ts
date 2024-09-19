import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { LoginComponent } from './components/login/login.component';
import { MenuComponent } from './components/menu/menu.component';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AlmacenComponent } from './components/almacen/almacen.component';
import { ProductoComponent } from './components/producto/producto.component';
import { ProveedorComponent } from './components/proveedor/proveedor.component';
import { EntradaComponent } from './components/entrada/entrada.component';
import { SalidaComponent } from './components/salida/salida.component';
import { RolComponent } from './components/configuracion/rol/rol.component';
import { UsuarioComponent } from './components/configuracion/usuario/usuario.component';

// import { PageNotFoundComponent } from './';

const APP_ROUTES: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    {
        path: 'menu',
        component: MenuComponent,
        children: [
            { path: 'dashboard', component: DashboardComponent },
            { path: 'almacen', component: AlmacenComponent },
            { path: 'producto', component: ProductoComponent },
            { path: 'proveedor', component: ProveedorComponent },
            { path: 'entrada', component: EntradaComponent },
            { path: 'salida', component: SalidaComponent },
            { path: 'rol', component: RolComponent },
            { path: 'usuario', component: UsuarioComponent },
            { path: '**', pathMatch: 'full', redirectTo: 'dashboard' }
        ]
    },
    { path: '**', pathMatch: 'full', redirectTo: 'login' }

    // { path: '**', component: PageNotFoundComponent },

    // { path: 'path/:routeParam', component: MyComponent },
    // { path: 'staticPath', component: ... },
    // { path: '**', component: ... },
    // { path: 'oldPath', redirectTo: '/staticPath' },
    // { path: ..., component: ..., data: { message: 'Custom' }
];

export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES, {useHash: true});
