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

  searchProveedores(page?) {
    return this.http.get(this.global.getUrl() + `proveedor/${page}`, {headers: this.headers});
  }
  getProveedor(id: string) {
    return this.http.get(this.global.getUrl() + `proveedor/get/${id}`, {headers: this.headers});
  }
  getOdooPartners(data, page: number, sizePage: number) {
    return this.http.post(this.global.getUrl() + `proveedor/odoo/search/${sizePage}/${page}`, data, {headers: this.headers});
  }
  insertProveedor( data: any ) {
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
}
