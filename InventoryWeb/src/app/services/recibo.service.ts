import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalService } from './Global';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class ReciboService {
  headers: HttpHeaders;
  options: any;

  constructor(private http: HttpClient, private global: GlobalService) {
    this.headers = new HttpHeaders({ Authorization : this.global.getToken() });
  }

  searchRecibos(data, page: number, sizePage: number) {
    return this.http.post(this.global.getUrl() + `recibo/search/${sizePage}/${page}`, data, {headers: this.headers});
  }
  getRecibo(idRecibo) {
    return this.http.get(this.global.getUrl() + `recibo/get/${idRecibo}`, {headers: this.headers});
  }
  saveRecibo(data) {
    return this.http.post(this.global.getUrl() + 'recibo/save/', data, {headers: this.headers});
  }
  updateRecibo(idRecibo, data) {
    return this.http.put(this.global.getUrl() + `recibo/update/${idRecibo}`, data, {headers: this.headers});
  }
  deleteRecibo(idRecibo) {
    return this.http.delete(this.global.getUrl() + `recibo/delete/${idRecibo}`, {headers: this.headers})
    .pipe(map((response: Response) => response));
  }
}
