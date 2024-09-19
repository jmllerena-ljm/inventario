import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CriterioService {
  private criterios: TypeModel[] = [
    {code: 'C01', name: 'Tiempo de entrega dias', description: '', type: 'Comercial', value: 0, status: true },
    {code: 'C02', name: 'Forma de Pago', description: '', type: 'Comercial', value: 0, status: true },
    {code: 'C03', name: 'Lugar Entrega', description: '', type: 'Comercial', value: 0, status: true },
    {code: 'C04', name: 'Gasto de Transporte aprox', description: '', type: 'Comercial', value: 0, status: true },
    {code: 'C05', name: 'Posibilidad de financia el pago', description: 'NO', type: 'Comercial', value: 0, status: true },
    {code: 'C06', name: 'Posibilidad de devolucion del producto', description: 'NO', type: 'Comercial', value: 0, status: true },
    {code: 'C07', name: 'Seguro de producto contratado', description: 'NO', type: 'Comercial', value: 0, status: true },
    {code: 'T01', name: 'Calidad de Producto (1-10)', description: '', type: 'Tecnica', value: 0, status: true },
    {code: 'T02', name: 'Dossier Calidad', description: 'NO', type: 'Tecnica', value: 0, status: true },
    {code: 'T03', name: 'Periodo de Garantia', description: '', type: 'Tecnica', value: 0, status: true },
    {code: 'T04', name: 'Servicio de Asistencia Tecnica', description: 'NO', type: 'Tecnica', value: 0, status: true },
    {code: 'T05', name: 'MODELO', description: '', type: 'Tecnica', value: 0, status: true },
    {code: 'T06', name: 'MARCA', description: '', type: 'Tecnica', value: 0, status: true },
    {code: 'T07', name: 'TIPO', description: '', type: 'Tecnica', value: 0, status: true },
    {code: 'T08', name: 'OTROS', description: '', type: 'Tecnica', value: 0, status: true },
  ]

  private cuadros: any = [
    { code: 'C02', // CUADRO 1
      data: [
        {code: 1, name: 'NO PRECISA', value:	0 },
        {code: 2, name: 'CONTADO', value:	0.1 },
        {code: 3, name: 'CHEQUE DIFERIDO', value:	0.2 },
        {code: 4, name: 'LETRA 30 DIAS', value:	0.3 },
        {code: 5, name: 'LETRA 60 DIAS', value:	0.4 },
        {code: 6, name: 'FACTURA 7 DIAS', value:	0.5 },
        {code: 7, name: 'FACTURA 15 DIAS', value:	0.6 },
        {code: 8, name: 'FACTURA 30 DIAS', value:	0.7 },
        {code: 9, name: 'FACTURA 45 DIAS', value:	0.8 },
        {code: 10, name: 'FACTURA 60 DIAS', value:	0.9 },
        {code: 11, name: 'FACTURA 90 DIAS', value:	1 }
      ]
    },
    { code: 'C03', // CUADRO 2
      data: [
        {code: 1, name: 'NO PRECISA', value:	0 },
        {code: 2, name: 'ALMACEN PROVEEDOR LIMA', value:	0.17 },
        {code: 3, name: 'ALMACEN PROVEEDOR AREQUIPA', value:	0.33 },
        {code: 4, name: 'AGENCIA LIMA', value:	0.5 },
        {code: 5, name: 'AGENCIA AQP', value:	0.67 },
        {code: 6, name: 'OFICINA AQP', value:	0.83 },
        {code: 7, name: 'PLANTA LA JOYA', value:	1 }
      ]
    },
    { code: 'C05', // CUADRO 3
      data: [
        {code: 1, name: 'NO PRECISA', value:	0 },
        {code: 2, name: 'NO', value:	0.5 },
        {code: 3, name: 'SI', value:	1 }
      ]
    },
    { code: 'T01', // CUADRO 4
      data: [
        {code: 1, name: 'NO PRECISA', value:	0 },
        {code: 2, name: '1', value:	0.1 },
        {code: 3, name: '2', value:	0.2 },
        {code: 4, name: '3', value:	0.3 },
        {code: 5, name: '4', value:	0.4 },
        {code: 6, name: '5', value:	0.5 },
        {code: 7, name: '6', value:	0.6 },
        {code: 8, name: '7', value:	0.7 },
        {code: 9, name: '8', value:	0.8 },
        {code: 10, name: '9', value:	0.9 },
        {code: 11, name: '10', value:	1 }
      ]
    },
    { code: 'T03', // CUADRO 5
      data: [
        {code: 1, name:	'NO PRECISA', value: 0},
        {code: 2, name:	'SIN GARANTIA', value: 0.1},
        {code: 3, name:	'GARANTIA 7 DIAS', value: 0.2},
        {code: 4, name:	'GARANTIA 15 DIAS', value: 0.3},
        {code: 5, name:	'GARANTIA 30 DIAS', value: 0.4},
        {code: 6, name:	'GARANTIA 45 DIAS', value: 0.5},
        {code: 7, name:	'GARANTIA 2 MESES', value: 0.6},
        {code: 8, name:	'GARANTIA 6 MESES', value: 0.7},
        {code: 9, name:	'GARANTIA 12 MESES', value: 0.8},
        {code: 10, name:	'GARANTIA 24 MESES', value: 0.9},
        {code: 11, name:	'GARANTIA 36 MESES', value: 1}
      ]
    },
    {
      code: 'T04', // CUADRO 6
      data: [
        {code: 1, name: 'NO PRECISA', value:	0 },
        {code: 2, name: 'NO', value:	0.5 },
        {code: 3, name: 'SI', value:	1 }
      ]
    },
    {
      code: 'T02', // CUADRO 7
      data: [
        {code: 1, name: 'NO PRECISA', value:	0 },
        {code: 2, name: 'NO', value:	0.5 },
        {code: 3, name: 'SI', value:	1 }
      ]
    },
    {
      code: 'C07', // CUADRO 8
      data: [
        {code: 1, name: 'NO PRECISA', value:	0 },
        {code: 2, name: 'NO', value:	0.5 },
        {code: 3, name: 'SI', value:	1 }
      ]
    },
    {
      code: 'C06', // CUADRO 9
      data: [
        {code: 1, name: 'NO PRECISA', value:	0 },
        {code: 2, name: 'NO', value:	0.5 },
        {code: 3, name: 'SI', value:	1 }
      ]
    }
  ]
  constructor() { }

  searchCriterios(data?) {
    let crits = (data) ? (data) : JSON.parse(JSON.stringify(this.criterios));
    for (let i = 0; i < crits.length; i++) {
      crits[i].options = this.getCuadro(crits[i].code);
    }
    return crits;
  }
  getCriterio(idx: number) {
    return this.criterios[idx];
  }
  getCuadro(codigo) {
    let cuadro = this.cuadros.find(x => x.code === codigo);
    return (cuadro) ? cuadro.data : [];
  }
  getValorPorcentage(codigo, nombre) {
    let texto = nombre.trim().toLowerCase();
    let datos = this.cuadros.find(x => x.code === codigo);
    if (!datos) {
      return 0;
    } else {
      let result = datos.data.find(a => a.name.toLowerCase() === texto);
      return (result) ? result.value * 100 : 0;
    }
  }
  getValorPorcCosto(codigo, data) {
    let array = [];
    for (let i = 0; i < data.length; i++) {
      const elem = data[i].lista_detalle.find(x => x.code === codigo);
      array.push((elem) ? Number(elem.description) : 0);
    }
    let minimo = Math.min.apply(null, array);
    return Number(minimo);
  }
}

export interface TypeModel {
    code: String;
    name: String,
    description: String,
    type: String,
    value: Number,
    status: Boolean,
    options?: any[]
}
