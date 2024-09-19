import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { GlobalService } from './Global';

@Injectable({
  providedIn: 'root'
})
export class DocsRegisterService {
  headers: HttpHeaders;
  options: any;
  constructor(private http: HttpClient, private global: GlobalService) {
    this.headers = new HttpHeaders({ Authorization : this.global.getToken() });
  }

  searchDocsRegister(data) {
    return this.http.post(this.global.getUrl() + 'docs-register/search', data, {headers: this.headers});
  }
  saveDocRegister( data: any ) {
    return this.http.post(this.global.getUrl() + 'docs-register/save', data, {headers: this.headers})
    .pipe(map((response: Response) => response));
  }
  updateDocRegister( data: any, id: string ) {
    return this.http.put(this.global.getUrl() + `docs-register/update/${id}`, data, {headers: this.headers})
    .pipe(map((response: Response) => response));
  }
  deleteDocRegister( data: any, id: string ) {
    return this.http.put(this.global.getUrl() + `docs-register/update/${id}`, data, {headers: this.headers})
    .pipe(map((response: Response) => response));
  }

  approveDocRegister( id: string ) {
    return this.http.put(this.global.getUrl() + `docs-register/approve-document/${id}`, {}, {headers: this.headers})
    .pipe(map((response: Response) => response));
  }
}

