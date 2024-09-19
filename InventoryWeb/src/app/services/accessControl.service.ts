import { Injectable } from '@angular/core';
import { GlobalService } from './Global';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AccessControlService {

    constructor( private global: GlobalService, private router: Router ) { }

    checkAccess(user, codeAccess): AccessControlModel {
        let findAccess: AccessControlModel;
        let list_access: any = window.localStorage.getItem('session_access');
        if ( list_access === null ) {
            this.global.goToLogin();
            this.global.showNotification('No tiene acceso, Inicie Sesion', 'danger');
        } else {
            let dataAccess: any = JSON.parse(list_access);
            let itemAccess = dataAccess.find(x => x.acceso.code === codeAccess);
            if (itemAccess) {
                findAccess = {
                    Id: itemAccess.acceso._id,
                    NivelAcceso: itemAccess.accessLevel,
                    Download: false, // itemAccess.Download,
                    SuperUser: false // itemAccess.SuperUser
                };
                return findAccess;
            } else {
                this.global.showNotification('No tiene permisos para acceder a esta pagina', 'warning');
                this.router.navigate(['/menu/dashboard']);
            }
        }
    }
}

export interface AccessControlModel {
    Id: Number;
    NivelAcceso: Boolean;
    Download: Boolean;
    SuperUser: Boolean;
}
