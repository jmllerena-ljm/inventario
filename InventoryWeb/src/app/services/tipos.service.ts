import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { GlobalService } from './Global';

@Injectable({
  providedIn: 'root'
})
export class TiposService {
  headers: HttpHeaders;
  options: any;
  private types: TypeModel[] = [
    {id: 0, name: '', text: '(ninguno)', status: true },
    {id: 1, name: 'ACEITE', text: 'ACEITE', status: true },
    {id: 2, name: 'ACEROS', text: 'ACEROS', status: true },
    {id: 3, name: 'ADITIVO', text: 'ADITIVO', status: true },
    {id: 4, name: 'ANALISIS', text: 'ANALISIS', status: true },
    {id: 5, name: 'AUTOMOTRIZ', text: 'AUTOMOTRIZ', status: true },
    {id: 6, name: 'BOLAS', text: 'BOLAS', status: true },
    {id: 7, name: 'BOLSAS', text: 'BOLSAS', status: true },
    {id: 8, name: 'CAJA CHICA', text: 'CAJA CHICA', status: true },
    {id: 9, name: 'CARRERA', text: 'CARRERA', status: true },
    {id: 10, name: 'CONFECCION', text: 'CONFECCION', status: true },
    {id: 11, name: 'EPP', text: 'EPP', status: true },
    {id: 12, name: 'EQUIPOS', text: 'EQUIPOS', status: true },
    {id: 13, name: 'ESCRITORIOS', text: 'ESCRITORIOS', status: true },
    {id: 14, name: 'FERRETERIA', text: 'FERRETERIA', status: true },
    {id: 15, name: 'IMPRESIÓN', text: 'IMPRESIÓN', status: true },
    {id: 16, name: 'LANAS', text: 'LANAS', status: true },
    {id: 17, name: 'LIMPIEZA - CONSUMO', text: 'LIMPIEZA - CONSUMO', status: true },
    {id: 18, name: 'LLANTAS', text: 'LLANTAS', status: true },
    {id: 19, name: 'MALLAS', text: 'MALLAS', status: true },
    {id: 20, name: 'MEDICINAS', text: 'MEDICINAS', status: true },
    {id: 21, name: 'METAL MECANICA', text: 'METAL MECANICA', status: true },
    {id: 22, name: 'MUEBLES', text: 'MUEBLES', status: true },
    {id: 23, name: 'OFIMATICA', text: 'OFIMATICA', status: true },
    {id: 24, name: 'OTROS', text: 'OTROS', status: true },
    {id: 25, name: 'PAPEL HIEGIENICO', text: 'PAPEL HIEGIENICO', status: true },
    {id: 26, name: 'PINTURA', text: 'PINTURA', status: true },
    {id: 27, name: 'QUIMICOS', text: 'QUIMICOS', status: true },
    {id: 28, name: 'REFLACTARIOS', text: 'REFLACTARIOS', status: true },
    {id: 29, name: 'REPUESTOS', text: 'REPUESTOS', status: true },
    {id: 30, name: 'RODAMIENTOS', text: 'RODAMIENTOS', status: true },
    {id: 31, name: 'SERVICIOS', text: 'SERVICIOS', status: true },
    {id: 32, name: 'SOLDADURA', text: 'SOLDADURA', status: true },
    {id: 33, name: 'TUBOS', text: 'TUBOS', status: true },
    {id: 34, name: 'GASES', text: 'GASES', status: true },
    {id: 35, name: 'SOLDADURA', text: 'SOLDADURA', status: true },
    {id: 36, name: 'ELECTRICO', text: 'ELECTRICO', status: true },
    {id: 37, name: 'FILTROS', text: 'FILTROS', status: true },
    {id: 38, name: 'PERNOS', text: 'PERNOS', status: true },
  ]
  constructor(private http: HttpClient, private global: GlobalService) {
    this.headers = new HttpHeaders({ Authorization : this.global.getToken() });
  }

  searchTipos(data) {
    return this.http.post(this.global.getUrl() + 'tipo/search', data, {headers: this.headers});
  }
  saveTipo( data: any ) {
    return this.http.post(this.global.getUrl() + 'tipo/save', data, {headers: this.headers})
    .pipe(map((response: Response) => response));
  }
  updateTipo( data: any, id: string ) {
    return this.http.put(this.global.getUrl() + `tipo/update/${id}`, data, {headers: this.headers})
    .pipe(map((response: Response) => response));
  }
}

export interface TypeModel {
    id: Number;
    name: String;
    text: String;
    status: Boolean;
}
