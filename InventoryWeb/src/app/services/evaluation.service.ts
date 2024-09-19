import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalService } from './Global';
@Injectable({
  providedIn: 'root'
})
export class EvaluationService {
  headers: HttpHeaders;
  options: any;

  constructor(private http: HttpClient, private global: GlobalService) {
    this.headers = new HttpHeaders({ Authorization : this.global.getToken() });
  }

  searchEvaluations(idLicDet, database) {
    return this.http.get(this.global.getUrl() + `evaluation/search/${idLicDet}/${database}`, {headers: this.headers});
  }
  saveEvaluations(idLicDet, data) {
    return this.http.put(this.global.getUrl() + `evaluation/save/${idLicDet}`, data, {headers: this.headers});
  }
}
