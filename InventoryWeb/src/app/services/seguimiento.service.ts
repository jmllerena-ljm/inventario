import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalService } from './Global';

@Injectable({
  providedIn: 'root'
})
export class SeguimientoService {
  headers: HttpHeaders;
  options: any;

  constructor(private http: HttpClient, private global: GlobalService) {
    this.headers = new HttpHeaders({ Authorization : this.global.getToken() });
  }
  searchOdooSeguimientos(data: any, count: number, page: number) {
    return this.http.post(this.global.getUrl() + `seguimiento/odoo/search/${count}/${page}`, data, {headers: this.headers});
  }
  searchSeguimientos(page?) {
    return this.http.post(this.global.getUrl() + `seguimiento/search`, {headers: this.headers});
  }
  getSeguimiento(idLicitacion, idLicitacionDet, idProduct, database) {
    return this.http.get(this.global.getUrl() + `seguimiento/get/${idLicitacion}/${idLicitacionDet}/${idProduct}/${database}`, {headers: this.headers});
  }
  insertSeguimiento( data: any ) {
    return this.http.post(this.global.getUrl() + 'seguimiento/save', data, {headers: this.headers});
  }
  updateSeguimiento( data: any, id: string ) {
    return this.http.put(this.global.getUrl() + `seguimiento/update/${id}`, data, {headers: this.headers});
  }
  reporteSeguimiento( data: any ) {
    return this.http.post(this.global.getUrl() + 'seguimiento/reporte', data, {headers: this.headers});
  }
  reporteTopCompras( data: any ) {
    return this.http.post(this.global.getUrl() + 'seguimiento/reporte/topcompras', data, {headers: this.headers});
  }
  downloadOdooSeguimiento(data: any) {
    return this.http.post(this.global.getUrl() + 'seguimiento/odoo/download-fulldata', data, {headers: this.headers});
  }
}
