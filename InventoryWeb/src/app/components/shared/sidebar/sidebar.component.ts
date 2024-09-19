import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from '../../../services/Global';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [];
// export const ROUTES: RouteInfo[] = [
//   { path: '/menu/dashboard', title: 'Dashboard',  icon: 'fa fa-home', class: '' },
//   { path: '/menu/reposiciones', title: 'Reposiciones',  icon: 'fa fa-boxes', class: '' },
//   { path: '/menu/almacen', title: 'Almacen',  icon: 'fa fa-boxes', class: '' },
//   { path: '/menu/movimientos', title: 'Movimientos',  icon: 'fa fa-edit', class: '' },
//   { path: '/menu/seguimiento', title: 'SECOM',  icon: 'fa fa-shopping-cart', class: '' },
//   { path: '/menu/recibo', title: 'Recibo de Egresos',  icon: 'fa fa-clipboard', class: '' },
//   { path: '/menu/agua', title: 'Registro de Agua',  icon: 'fa fa-tint', class: '' },
//   { path: '/menu/docs-register', title: 'Registro de Documentos',  icon: 'fa fa-file-alt', class: '' },
//   { path: '/menu/reporte', title: 'Reportes',  icon: 'fa fa-chart-line', class: '' },
//   { path: '/menu/configuracion', title: 'Configuraciones',  icon: 'fa fa-cogs', class: '' },
//   { path: '/menu/administracion/usuarios', title: 'Usuarios',  icon: 'fa fa-users-cog', class: '' },
// ];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  identity: any = null;
  menuItems: any[];

  constructor( private router: Router, private global: GlobalService ) { }

  ngOnInit() {
    this.identity = this.global.getIdentity();
    this.createMenu();
    // if (this.identity.rol === 'RECIBOS_EGRESOS') {
    //   this.menuItems = ROUTES.filter(menuItem => (menuItem.path === '/menu/recibo' || menuItem.path === '/menu/dashboard'));
    // } else if (this.identity.rol === 'ALMACEN') {
    //   this.menuItems = ROUTES.filter(menuItem => (menuItem.path !== '/menu/recibo'));
    // } else if (this.identity.rol === 'REGISTRO_AGUA') {
    //   this.menuItems = ROUTES.filter(menuItem => (menuItem.path === '/menu/agua' || menuItem.path === '/menu/dashboard'));
    // } else {
    //   this.menuItems = ROUTES.filter(menuItem => menuItem);
    // }
  }

  createMenu() {
    let sessionAccess: any = window.localStorage.getItem('session_access');
    if ( sessionAccess === null ) {
      this.global.showNotification('No tiene acceso', 'danger');
      this.global.goToLogin();
    } else {
      let dataAccesos: any = JSON.parse(sessionAccess);
      let items = [
        { title: 'Dashboard', path: '/menu/dashboard', icon: 'fa fa-home' },
      ];
      if (dataAccesos !== undefined && dataAccesos.length > 0) {
        dataAccesos.forEach(acc => {
          items.push({ title: acc.acceso.description, path: acc.acceso.link, icon: acc.acceso.iconName });
        });
      }
      this.menuItems = items;
    }
  }

  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  }
  logout() {
    localStorage.clear();
    this.router.navigate(['/']).then(() => { window.location.reload(); });
  }
}
