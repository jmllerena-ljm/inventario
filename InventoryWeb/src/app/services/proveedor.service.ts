import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { GlobalService } from './Global';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {
  headers: HttpHeaders;
  options: any;

  constructor(private http: HttpClient, private global: GlobalService) {
    this.headers = new HttpHeaders({ Authorization : this.global.getToken() });
  }
  
  // CRUD - Mongo DB
  searchProveedores(data) {
    return this.http.post(this.global.getUrl() + `proveedor/search`, data, {headers: this.headers});
  }
  getProveedor(id: string) {
    return this.http.get(this.global.getUrl() + `proveedor/get/${id}`, {headers: this.headers});
  }
  saveProveedor( data: any ) {
    return this.http.post(this.global.getUrl() + 'proveedor/save', data, {headers: this.headers})
    .pipe(map((response: Response) => response));
  }
  updateProveedor( data: any, id: string ) {
    return this.http.put(this.global.getUrl() + `proveedor/update/${id}`, data, {headers: this.headers})
    .pipe(map((response: Response) => response));
  }
  deleteProveedor( id: string ) {
    return this.http.delete(this.global.getUrl() + `proveedor/delete/${id}`, {headers: this.headers})
    .pipe(map((response: Response) => response));
  }

  // Procedimientos Odoo
  searchOdooPartners(data, page: number, sizePage: number) {
    return this.http.post(this.global.getUrl() + `proveedor/odoo/search/${sizePage}/${page}`, data, {headers: this.headers});
  }
  getOdooPartner(idSupplier) {
    return this.http.get(this.global.getUrl() + `proveedor/odoo/get/${idSupplier}`, {headers: this.headers});
  }
  getOdoo13Partner(idSupplier) {
    return this.http.get(this.global.getUrl() + `proveedor/odoo13/get/${idSupplier}`, {headers: this.headers});
  }
}
