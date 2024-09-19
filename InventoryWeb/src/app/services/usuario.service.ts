import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { GlobalService } from './Global';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  headers: HttpHeaders;
  options: any;
  constructor(private http: HttpClient, private global: GlobalService) {
    this.headers = new HttpHeaders({ Authorization : this.global.getToken() });
  }

  searchUsuarios(data) {
    return this.http.post(this.global.getUrl() + 'usuario/search', data, {headers: this.headers});
  }
  getUsuario(id: string) {
    return this.http.get(this.global.getUrl() + `usuario/get/${id}`, {headers: this.headers});
  }
  insertUsuario( data: any ) {
    return this.http.post(this.global.getUrl() + 'usuario/save', data, {headers: this.headers})
    .pipe(map((response: Response) => response));
  }
  updateUsuario( data: any, id: string ) {
    return this.http.put(this.global.getUrl() + `usuario/update/${id}`, data, {headers: this.headers})
    .pipe(map((response: Response) => response));
  }
  deleteUsuario( id: string ) {
    return this.http.delete(this.global.getUrl() + `usuario/delete/${id}`, {headers: this.headers})
    .pipe(map((response: Response) => response));
  }
  LoginUsuario( data: any, getHash: any = null ) {
    if (getHash != null) {
      data.gethash = getHash;
    }
    return this.http.post(this.global.getUrl() + 'usuario/login', data)
    .pipe(map((response: Response) => response));
  }
  LoginOdooUsuario( data: any, getHash: any = null ) {
    if (getHash != null) {
      data.gethash = getHash;
    }
    return this.http.post(this.global.getUrl() + 'usuario/odoo/login', data)
    .pipe(map((response: Response) => response));
  }

  // Accesos
  searchAccess() {
    return this.http.get(this.global.getUrl() + 'usuario/acceso/search', {headers: this.headers});
  }
}
