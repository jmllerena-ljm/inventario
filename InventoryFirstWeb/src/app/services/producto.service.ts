import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { GlobalService } from './Global';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  headers: HttpHeaders;
  options: any;

  constructor(private http: HttpClient, private global: GlobalService) {
    this.headers = new HttpHeaders({ Authorization : this.global.getToken() });
  }

  getProducto(id: string) {
    return this.http.get(this.global.getUrl() + `producto/get/${id}`, {headers: this.headers});
  }
  getOdooProducts(data, page: number, sizePage: number) {
    return this.http.post(this.global.getUrl() + `producto/odoo/search/${sizePage}/${page}`, data, {headers: this.headers});
  }
}
