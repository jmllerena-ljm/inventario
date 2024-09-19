import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { GlobalService } from './Global';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
    headers: HttpHeaders;
    options: any;
        constructor(private http: HttpClient, private global: GlobalService) {
        this.headers = new HttpHeaders({ Authorization : this.global.getToken() });
    }

    searchCompanies(data) {
        return this.http.post(this.global.getUrl() + 'company/search', data, {headers: this.headers});
    }
    saveCompany( data: any ) {
        return this.http.post(this.global.getUrl() + 'company/save', data, {headers: this.headers})
        .pipe(map((response: Response) => response));
    }
    updateCompany( data: any, id: string ) {
        return this.http.put(this.global.getUrl() + `company/update/${id}`, data, {headers: this.headers})
        .pipe(map((response: Response) => response));
    }
}
