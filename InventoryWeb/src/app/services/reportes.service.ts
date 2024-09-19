import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { GlobalService } from './Global';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {
  headers: HttpHeaders;
  options: any;
  constructor(private http: HttpClient, private global: GlobalService) {
    this.headers = new HttpHeaders({ Authorization : this.global.getToken() });
  }
  searchPreciosPromedioProducto( data: any ) {
    return this.http.post(this.global.getUrl() + 'reportes/search/precios-promedio-producto', data, {headers: this.headers})
    .pipe(map((response: Response) => response));
  }
}
