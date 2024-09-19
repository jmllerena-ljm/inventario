import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalService } from './Global';
@Injectable({
  providedIn: 'root'
})
export class EntradasService {
  headers: HttpHeaders;
  options: any;

  constructor(private http: HttpClient, private global: GlobalService) {
    this.headers = new HttpHeaders({ Authorization : this.global.getToken() });
  }

  getEntradas(data, page: number, sizePage: number) {
    return this.http.post(this.global.getUrl() + `entradas/search/${sizePage}/${page}`, data, {headers: this.headers});
  }
  getDetalle(id: string) {
    return this.http.get(this.global.getUrl() + `entradas/detalle/${id}`, {headers: this.headers});
  }
  saveEntrada(data) {
    return this.http.post(this.global.getUrl() + `entradas/save`, data, {headers: this.headers});
  }
  updateEntrada(data, idEntrada, codeEntrada) {
    return this.http.put(this.global.getUrl() + `entradas/update/${idEntrada}/${codeEntrada}`, data, {headers: this.headers});
  }
  deleteEntrada(idEntrada) {
    return this.http.delete(this.global.getUrl() + `entradas/delete/${idEntrada}`, {headers: this.headers});
  }
  deleteDetalle(idDetail, idCompany) {
    return this.http.delete(this.global.getUrl() + `entradas/detalle/delete/${idDetail}/${idCompany}`, {headers: this.headers});
  }

  getOdooStockPicking(data, page: number, sizePage: number) {
    return this.http.post(this.global.getUrl() + `entradas/odoo/search/${sizePage}/${page}`, data, {headers: this.headers});
  }
  getOdooDetalleStockPicking(id: number, type: number) {
    return this.http.get(this.global.getUrl() + `entradas/odoo/detalle/get/${id}/${type}`, {headers: this.headers});
  }
  getOdooProductoPrecio(data) {
    return this.http.post(this.global.getUrl() + 'entradas/odoo/producto/precio', data, {headers: this.headers});
  }

  getReporte(data, page: number, sizePage: number) {
    return this.http.post(this.global.getUrl() + `entradas/reporte/${sizePage}/${page}`, data, {headers: this.headers});
  }
  getDetalleProducto(idProduct: string, company: string) {
    return this.http.get(this.global.getUrl() + `entradas/get/detalle/${idProduct}/${company}`, {headers: this.headers});
  }
}
