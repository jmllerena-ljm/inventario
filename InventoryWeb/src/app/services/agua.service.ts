import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { GlobalService } from './Global';

@Injectable({
  providedIn: 'root'
})
export class AguaService {
  headers: HttpHeaders;
  options: any;
  constructor(private http: HttpClient, private global: GlobalService) {
    this.headers = new HttpHeaders({ Authorization : this.global.getToken() });
  }

  searchAgua(data) {
    return this.http.post(this.global.getUrl() + 'agua/search', data, {headers: this.headers});
  }
  saveAgua( data: any ) {
    return this.http.post(this.global.getUrl() + 'agua/save', data, {headers: this.headers})
    .pipe(map((response: Response) => response));
  }
  updateAgua( data: any, id: string ) {
    return this.http.put(this.global.getUrl() + `agua/update/${id}`, data, {headers: this.headers})
    .pipe(map((response: Response) => response));
  }
  deleteAgua( data: any, id: string ) {
    return this.http.put(this.global.getUrl() + `agua/update/${id}`, data, {headers: this.headers})
    .pipe(map((response: Response) => response));
  }
}

