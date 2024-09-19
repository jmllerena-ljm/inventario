import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import jsPDF from 'jspdf';
import { GlobalService } from './Global';

@Injectable({
  providedIn: 'root'
})
export class PrintService {

  constructor(private global: GlobalService) {
  }
  printGuide(FormPrint: any, detailData: any) {
    let _fPrint = FormPrint;
    const _date = _fPrint.date.match(/\d{4}\-\d{2}\-\d{2}/);
    let _split = (_date[0]).split('-');
    let _table = detailData;
    let doc = new jsPDF('p', 'mm', 'a4');
    doc.setFontSize(11); // 7.5
    // doc.setFont('times');
    // doc.setFont('courier');
    // doc.setFontType('normal');
    doc.text(43, 51, (_split.length === 3) ? _split[2] : ''); // Fecha: DIA
    doc.text(58, 51, (_split.length === 3) ? _split[1] : ''); // Fecha: MES
    doc.text(72, 51, (_split.length === 3) ? _split[0] : ''); // Fecha: AÑO
    doc.text(40, 57, _fPrint.receiver.toUpperCase()); // Destinatario
    doc.text(40, 64, _fPrint.starting_point.toUpperCase()); // Punto partida
    doc.text(40, 71, _fPrint.arrival_point.toUpperCase()); // Punto llegada
    doc.text(132, 77, _fPrint.doc_identify); // Ruc o Doc
    doc.text(181, 77, _fPrint.number_invoice.toUpperCase()); // Nro Fact.

    doc.text(30, 286.5, _fPrint.vehicle_mark.toUpperCase()); // Marca Vehiculo
    doc.text(80, 286.5, _fPrint.plate_number.toUpperCase()); // Placa
    doc.text(135, 286.5, _fPrint.constancy_ins.toUpperCase()); // Constancia
    doc.text(180, 286.5, _fPrint.license_number.toUpperCase()); // Nro Licencia
    doc.text(30, 293, _fPrint.carrier_name.toUpperCase()); // Transportista
    doc.text(170, 293, _fPrint.carrier_ruc.toUpperCase()); // Ruc Transp.

    let yValue = 108;
    _table.forEach((item) => {
      doc.text(8, yValue, (item.description ? item.description.length > 45 ? item.description.substring(0, 45) : item.description : '')); // DESCRIPCION
      doc.text(130, yValue, (item.unit) ? item.unit : ''); // UNIDAD
      doc.text(151, yValue, (item.qty) ? item.qty.toString() : ''); // CANTIDAD
      doc.text(168, yValue, (item.purchase_order) ? item.purchase_order : ''); // NRO PO
      doc.text(183, yValue, (item.number_lic) ? item.number_lic : ''); // NRO LICITACION
      yValue += 6;
    });
    doc.save('Guia ' + (_fPrint.number_guide ? _fPrint.number_guide.trim() :  new  Date().getTime()) + '.pdf');
  }
}
