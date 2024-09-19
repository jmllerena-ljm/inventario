import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { GlobalService } from './Global';

@Injectable({
    providedIn: 'root'
})
export class PeriodoIqbfService {
    headers: HttpHeaders;
    options: any;
        constructor(private http: HttpClient, private global: GlobalService) {
        this.headers = new HttpHeaders({ Authorization : this.global.getToken() });
    }

    getPeriodoIqbf() {
        return this.http.get(this.global.getUrl() + 'periodo-iqbf/get', {headers: this.headers});
    }
    savePeriodoIqbf( data: any ) {
        return this.http.post(this.global.getUrl() + 'periodo-iqbf/save', data, {headers: this.headers})
        .pipe(map((response: Response) => response));
    }
    updatePeriodoIqbf( data: any, id: string ) {
        return this.http.put(this.global.getUrl() + `periodo-iqbf/update/${id}`, data, {headers: this.headers})
        .pipe(map((response: Response) => response));
    }
}
