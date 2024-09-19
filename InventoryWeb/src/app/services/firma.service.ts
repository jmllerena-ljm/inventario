import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { GlobalService } from './Global';

@Injectable({
  providedIn: 'root'
})
export class FirmaService {
  headers: HttpHeaders;
  options: any;

  constructor(private http: HttpClient, private global: GlobalService) {
    this.headers = new HttpHeaders({ Authorization : this.global.getToken() });
  }
  searchFirmas(data) {
    return this.http.post(this.global.getUrl() + 'firma/search', data, {headers: this.headers});
  }
  getFirma(code: string) {
    return this.http.get(this.global.getUrl() + `firma/get/${code}`, {headers: this.headers});
  }
  saveFirma( data: any ) {
    return this.http.post(this.global.getUrl() + 'firma/save', data, {headers: this.headers})
    .pipe(map((response: Response) => response));
  }
  updateFirma( data: any, code: string ) {
    return this.http.put(this.global.getUrl() + `firma/update/${code}`, data, {headers: this.headers})
    .pipe(map((response: Response) => response));
  }
  getImageFirma(path) {
    return this.http.get(this.global.getUrl() + `firma/get-image/${path}`, {headers: this.headers});
  }
}
