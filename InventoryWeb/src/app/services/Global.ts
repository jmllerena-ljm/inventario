import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormGroup } from '@angular/forms';
declare var $: any;
@Injectable({
    providedIn: 'root'
})
export class GlobalService {
    // Puerto 3977 para Inventario MRP || Puerto 3978 para Maxpi MRP
    API_URL = 'http://' + window.location.hostname + ':3977/api/'; //Dev localhost
    //API_URL = 'http://54.224.61.111:3977/api/'; //Prod
    identity: any = null;
    token: string;
    constructor(
        private router: Router,
        private spinner: NgxSpinnerService
    ) {}
    getUrl() {
        return this.API_URL;
    }
    getIdentity() {
        const identity = JSON.parse(localStorage.getItem('session_user'));
        if (identity !== 'undefined' && identity !== null) {
            this.identity = identity;
        } else {
            this.identity = null;
        }
        return this.identity;
    }
    getToken() {
        const token = localStorage.getItem('session_token');
        if (token !== 'undefined' && token !== null) {
            this.token = token;
        } else {
            this.token = null;
        }
        return this.token;
    }
    getParseDate(fecha) {
        let Datef = new Date(fecha);
        let dia = Datef.getDate();
        let mes = (Datef.getMonth() < 12) ? Datef.getMonth() + 1 : Datef.getMonth();
        let yyyy = Datef.getFullYear();
        let dd = (dia < 10) ? '0' + dia : dia;
        let mm = (mes < 10) ? '0' + mes : mes;
        return yyyy + '-' + mm + '-' + dd;
    }
    getNumberFix(number, fix: number) {
        if (number === '' || number === null || number === undefined) {
            return '';
        } else {
            return parseFloat(number).toFixed(fix);
        }
    }
    getNumberFormatFix(numero, fix: number) {
        if (numero === '' || numero === null || numero === undefined) {
            return '';
        } else {
            let formatter = new Intl.NumberFormat('es-PE', { minimumFractionDigits: fix, maximumFractionDigits: fix});
            return formatter.format(numero);
        }
    }
    getPorcentageFix(numero, fix: number) {
        let formatter = new Intl.NumberFormat('es-PE', { style: 'percent', minimumFractionDigits: fix, maximumFractionDigits: fix });
        let num =  formatter.format(numero);
        return num;
    }
    showNotification( _message: string, _type: string = 'success', _from: string = 'top', _align: string = 'right') {
        const _title = (_type === 'danger') ? 'Error' : 'Success';
        $.notify(
            { title: _title, message: _message },
            { type: _type, timer: 2000, placement: { from: _from, align: _align },
                template: '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0}" role="alert">' +
                    '<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
                    '<span data-notify="title"><i class="fa fa-info-circle text-white"></i> <b>{1}</b></span>' +
                    '<span data-notify="message">{2}</span>' +
                '</div>'
            }
        );
        // $.notify('I have a progress bar', { showProgressbar: true });
    }
    displayError(error, showMsg: Boolean = true) {
        console.error(error);
        if (showMsg) {
            this.showNotification(error.error.message, 'danger');
        }
        if (error.status === 401) {
            setTimeout(() => {
                localStorage.clear();
                this.router.navigate(['/']).then(() => { window.location.reload(); });
            }, 2000);
        }
    }
    showSpinner(status: Boolean = true) {
        if (status) {
            this.spinner.show();
        } else {
            this.spinner.hide();
        }
    }
    goToLogin() {
        localStorage.clear();
        this.router.navigate(['/']);
    }

    validateChangeDataForm(form: FormGroup): any {
        let results: any = {};
        if (form.dirty) {
          let { controls } = form;
          for (const key in controls) {
            if(controls[key].dirty) {
                let _value = controls[key].value
              results[key] = (typeof(_value) == 'string') ? _value.trim() : _value;
            }
          }
        }
        return results;
      }
}
