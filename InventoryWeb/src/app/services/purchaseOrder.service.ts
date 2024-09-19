import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalService } from './Global';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class PurchaseOrderService {
  headers: HttpHeaders;
  options: any;

  constructor(private http: HttpClient, private global: GlobalService) {
    this.headers = new HttpHeaders({ Authorization : this.global.getToken() });
  }

  searchCompras(data) {
    return this.http.post(this.global.getUrl() + `purchase-order/compras`, data, {headers: this.headers});
  }
  searchDetalleCompras(idOrder) {
    return this.http.get(this.global.getUrl() + `purchase-order/compras-detalle/${idOrder}`, {headers: this.headers});
  }
}
