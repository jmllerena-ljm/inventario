import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { GlobalService } from './Global';

@Injectable({
  providedIn: 'root'
})
export class GuideService {
  headers: HttpHeaders;
  options: any;
    constructor(private http: HttpClient, private global: GlobalService) {
    this.headers = new HttpHeaders({ Authorization : this.global.getToken() });
  }
  
  searchGuides( data: any ) {
    return this.http.post(this.global.getUrl() + 'guide/search', data, {headers: this.headers})
    .pipe(map((response: Response) => response));
  }
  getGuide(id: string) {
    return this.http.get(this.global.getUrl() + `guide/get/${id}`, {headers: this.headers});
  }
  saveGuide( data: any ) {
    return this.http.post(this.global.getUrl() + 'guide/save', data, {headers: this.headers})
    .pipe(map((response: Response) => response));
  }
  updateGuide( data: any, id: string ) {
    return this.http.put(this.global.getUrl() + `guide/update/${id}`, data, {headers: this.headers})
    .pipe(map((response: Response) => response));
  }
}
