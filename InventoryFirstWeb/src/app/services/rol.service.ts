import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { GlobalService } from './Global';

@Injectable({
  providedIn: 'root'
})
export class RolService {
  headers: HttpHeaders;
  options: any;
  constructor(private http: HttpClient, private global: GlobalService) {
    this.headers = new HttpHeaders({ Authorization : this.global.getToken() });
  }
  searchRoles() {
    return this.http.get(this.global.getUrl() + 'rol', {headers: this.headers});
  }
  searchAccesos() {
    return this.http.get(this.global.getUrl() + 'acceso', {headers: this.headers});
  }
  getAccesosRol(id: string) {
    return this.http.get(this.global.getUrl() + `rol/accesosrol/${id}`, {headers: this.headers});
  }
  insertRol( data: any ) {
    return this.http.post(this.global.getUrl() + 'rol/save', data, {headers: this.headers})
    .pipe(map((response: Response) => response));
  }
  updateRol( data: any, id: string ) {
    return this.http.put(this.global.getUrl() + `rol/update/${id}`, data, {headers: this.headers})
    .pipe(map((response: Response) => response));
  }
  deleteRol( id: string ) {
    return this.http.delete(this.global.getUrl() + `rol/delete/${id}`, {headers: this.headers})
    .pipe(map((response: Response) => response));
  }
}
