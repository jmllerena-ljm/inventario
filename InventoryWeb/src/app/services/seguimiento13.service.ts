import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalService } from './Global';

@Injectable({
    providedIn: 'root'
})
export class Seguimiento13Service {
    headers: HttpHeaders;
    options: any;

    constructor(private http: HttpClient, private global: GlobalService) {
        this.headers = new HttpHeaders({ Authorization : this.global.getToken() });
    }
    searchOdoo13Seguimientos(data: any, count: number, page: number) {
        return this.http.post(this.global.getUrl() + `seguimiento13/odoo/search/${count}/${page}`, data, {headers: this.headers});
    }
    downloadOdoo13Seguimiento(data: any) {
        return this.http.post(this.global.getUrl() + 'seguimiento13/odoo/download-fulldata', data, {headers: this.headers});
    }
    getSeguimientoOdoo13(idLicitacion, idLicitacionDet, idProduct, database) {
        return this.http.get(this.global.getUrl() + `seguimiento13/get/${idLicitacion}/${idLicitacionDet}/${idProduct}/${database}`, {headers: this.headers});
    }
    insertSeguimientoOdoo13( data: any ) {
        return this.http.post(this.global.getUrl() + 'seguimiento13/save', data, {headers: this.headers});
    }
    updateSeguimientoOdoo13( data: any, id: string ) {
        return this.http.put(this.global.getUrl() + `seguimiento13/update/${id}`, data, {headers: this.headers});
    }
    updateVariosSeguimientosOdoo13( data: any ) {
        return this.http.post(this.global.getUrl() + `seguimiento13/update-varios`, data, {headers: this.headers});
    }

    // Faltantes
    reporteSeguimientoOdoo13( data: any ) {
        return this.http.post(this.global.getUrl() + 'seguimiento13/reporte', data, {headers: this.headers});
    }
    reporteTopComprasOdoo13( data: any ) {
        return this.http.post(this.global.getUrl() + 'seguimiento13/reporte/topcompras', data, {headers: this.headers});
    }
}
