import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalService } from './Global';

@Injectable({
  providedIn: 'root'
})
export class AlmacenService {
  headers: HttpHeaders;
  options: any;

  constructor(private http: HttpClient, private global: GlobalService) {
    this.headers = new HttpHeaders({ Authorization : this.global.getToken() });
  }
  searchProducts(data, page: number, sizePage: number) {
    return this.http.post(this.global.getUrl() + `almacen/search-products/${sizePage}/${page}`, data, {headers: this.headers});
  }
  getAlmacen(data, page: number, sizePage: number) {
    return this.http.post(this.global.getUrl() + `almacen/search/${sizePage}/${page}`, data, {headers: this.headers});
  }
  searchAlmacenIqbf(data, page: number, sizePage: number) {
    return this.http.post(this.global.getUrl() + `almacen/search-iqbf/${sizePage}/${page}`, data, {headers: this.headers});
  }
  getReporteCount() {
    return this.http.get(this.global.getUrl() + 'almacen/reporte/stock', {headers: this.headers});
  }
  getHistorialChanges(idAlmacen: string) {
    return this.http.get(this.global.getUrl() + 'almacen/get/historial-changes/' + idAlmacen, {headers: this.headers});
  }
  saveAlmacen(data) {
    return this.http.post(this.global.getUrl() + 'almacen/save', data, {headers: this.headers});
  }
  updateAlmacen(data, idAlmacen) {
    return this.http.put(this.global.getUrl() + `almacen/update/${idAlmacen}`, data, {headers: this.headers});
  }
}
