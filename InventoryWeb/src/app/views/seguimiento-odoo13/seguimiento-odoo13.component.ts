import { Component, OnInit } from '@angular/core';
import { Seguimiento13Service } from '../../services/seguimiento13.service';
import { GlobalService } from '../../services/Global';
import { ExcelService } from '../../services/excel.service';
import { EmailService } from '../../services/email.service';
import { EvaluationService } from '../../services/evaluation.service';
import { CriterioService } from '../../services/criterios.service';
import { CompanyService } from '../../services/company.service';
import { TiposService, TypeModel } from '../../services/tipos.service';
import { ProveedorService } from '../../services/proveedor.service';
import { GuideService } from '../../services/guide.service';

import { AccessControlModel, AccessControlService } from '../../services/accessControl.service';
import { PrintService } from '../../services/print.service';

import { NgxSpinnerService } from 'ngx-spinner';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as LOGO from '../../../assets/img/logo_ljm';

@Component({
  selector: 'app-seguimiento-odoo13',
  templateUrl: './seguimiento-odoo13.component.html',
  styleUrls: ['./seguimiento-odoo13.component.scss']
})
export class SeguimientoOdoo13Component implements OnInit {
  identity: any = null;
  accessLevel: AccessControlModel = { Id: -1, NivelAcceso: false, Download: false, SuperUser: false };
  gridData: any = [];
  countData: Number = 0;
  formSearch: FormGroup;
  formEdit: FormGroup;
  formEditGeneral: FormGroup;
  formEmail: FormGroup;
  formPrint: FormGroup;
  pageIndex = 1;
  pageSize = 50;
  selectType: any = [];
  itemEdit: any = {};
  idSegMongo: String = '';
  displayEdit: Boolean = false;
  displaySendEmail: Boolean = false;
  displayPrint: Boolean = false;
  displayEvaluation: Boolean = false;
  displayDetailGuide: Boolean = false;
  checkGeneral: Boolean = false;
  checkAutorizado: Boolean = false;
  idDetailGuia: string = null;
  // showEditItems: Boolean = false;
  explandSelectedItems: boolean = false;
  dataTypes: any[];
  dataPrint: any = [];
  dataBaseFilter: String = '';
  dataCheckSelected: any = [];
  obj_EditGeneral: any = {
    authorized: false,
    date2: '',
    type: '',
    number_solpe: '',
    guide: '',
    purchase: 0,
    received: 0,
    sent: 0,
    send_date: '',
    period: '',
    area: '',
    company: ''
  };
  // EVALUACION PROVEEDOR
  dataCriterios: any = [];
  dataEvaluacion: any = [];
  tableEvaluation: any = [];
  minValueEstimated: number;
  codigo_eval: string;
  formSearchSupp: FormGroup;
  dataSuppliers: any = [];
  activeSearchSupp: any = {};
  displaySearchSupp: Boolean = false;
  tipoMoneda: any = [{code: 1, name: 'USD', text: 'USD'}, {code: 2, name: 'PEN', text: 'PEN'}];
  fileCharged: any;
  displayUploadFile: Boolean = false;

  dataCompany: any = [];
  constructor(
    private seguimiento13Service: Seguimiento13Service,
    private global: GlobalService,
    private spinner: NgxSpinnerService,
    private excelService: ExcelService,
    private emailService: EmailService,
    private tiposService: TiposService,
    private evaluationService: EvaluationService,
    private criterioService: CriterioService,
    private proveedorService: ProveedorService,
    private accessControl: AccessControlService,
    private companyService: CompanyService,
    private guideService: GuideService,
    private printService: PrintService
  ) {
    this.formSearch = new FormGroup({
      lic_name: new FormControl(''),
      prod_name: new FormControl(''),
      solicitante: new FormControl(''),
      type: new FormControl(''),
      number_solpe: new FormControl(''),
      guide: new FormControl(''),
      con_saldo: new FormControl(false),
      date_ini: new FormControl(global.getParseDate(new Date(new Date().getFullYear(), 0, 1))),
      date_fin: new FormControl(global.getParseDate(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0))),
      company_id: new FormControl('')
    });
    this.formEditGeneral = new FormGroup({
      authorized: new FormControl(false),
      date2: new FormControl(''),
      type: new FormControl(''),
      number_solpe: new FormControl(''),
      guide: new FormControl(''),
      purchase: new FormControl(0),
      received: new FormControl(0),
      sent: new FormControl(0),
      send_date: new FormControl(''),
      period: new FormControl(''),
      area: new FormControl(''),
      company: new FormControl('')
    });
    this.formEdit = new FormGroup({
      lic_id: new FormControl(-1),
      lic_name: new FormControl(''),
      lic_det_id: new FormControl(-1),
      lic_date: new FormControl(''),
      authorized: new FormControl(false),
      date2: new FormControl(''),
      type: new FormControl(''),
      number_solpe: new FormControl(''),
      quoted: new FormControl(0),
      purchase: new FormControl(0),
      received: new FormControl(0),
      sent: new FormControl(0),
      guide: new FormControl(''),
      send_date: new FormControl(''),
      urgent: new FormControl(false),
      period: new FormControl(''),
      area: new FormControl(''),
      company: new FormControl(''),
      user_update: new FormControl(''),
      date_update: new FormControl(null),
      status: new FormControl(true)
    });
    this.formEmail = new FormGroup({
      to: new FormControl('', Validators.required),
      cc: new FormControl(''),
      subject: new FormControl('', Validators.required),
      html: new FormControl('', Validators.required)
    });
    this.formPrint = new FormGroup({
      date: new FormControl(''),
      receiver: new FormControl('LA JOYA MINING S.A.C.'),
      starting_point: new FormControl('AV. VARIANTE DE UCHUMAYO KM 1.5 SACHACA - AREQUIPA'),
      arrival_point: new FormControl('SAN JOSE MZ P LOTES 11 Y 12 LA JOYA - AREQUIPA'),
      doc_identify: new FormControl('20539627938'),
      number_invoice: new FormControl(''),
      number_guide: new FormControl('', Validators.required),
      vehicle_mark: new FormControl(''),
      plate_number: new FormControl(''),
      constancy_ins: new FormControl(''),
      license_number: new FormControl(''),
      carrier_name: new FormControl(''),
      carrier_ruc: new FormControl('')
    })
    this.formSearchSupp = new FormGroup({
      number: new FormControl(''),
      name: new FormControl('')
    })
  }

  readFileContent(file: File): Promise<any> {
    return new Promise<any>((resolve, reject) => {
        if (!file) {
            resolve('');
        }
        const reader = new FileReader();
        reader.onloadend = (e) => {
            const lines = reader.result.toString().split('\n');
            resolve(lines);
        };
        reader.readAsText(file);
    });
  }

  ngOnInit() {
    this.identity = this.global.getIdentity();
    if (this.identity === null) {
      this.global.goToLogin();
    } else {
      this.accessLevel = this.accessControl.checkAccess(this.identity.strUsuario, 'ACC-011');
      if (this.accessLevel) {
        this.bind();
      }
    }
  }
  bind() {
    if (this.accessLevel.NivelAcceso === false) {
      this.formEdit.disable();
    } else {
      this.formEdit.enable();
    }
    this.searchTipos();
    this.searchCompanies();
    // this.searchOdooSeguimientos();
  }

  searchTipos() {
    this.tiposService.searchTipos('').subscribe(
      response => {
        this.dataTypes = response['Data'];
      }, error => {
        this.global.displayError(error, false);
      }
    )
  }

  // SEARCH COMPANIES
  searchCompanies() {
    this.spinner.show();
    let data: any = { name: '' };
    this.companyService.searchCompanies(data).subscribe(
      response => {
        this.dataCompany = response;
        if (this.dataCompany.length > 0) {
          this.dataBaseFilter = this.dataCompany[0].code_odoo;
          this.spinner.hide();
          this.searchOdooSeguimientos();
        } else {
          this.spinner.hide();
          this.global.showNotification('No se encontraron datos de Campañas', 'danger')
        }
      }, error => {
        this.global.displayError(error);
        this.spinner.hide();
      }
    );
  }

  searchOdooSeguimientos() {
    // this.showEditItems = false;
    this.spinner.show();
    this.formSearch.patchValue({ company_id: this.dataBaseFilter });
    this.gridData = []; this.countData = 0;
    this.seguimiento13Service.searchOdoo13Seguimientos(this.formSearch.value, this.pageSize, this.pageIndex).subscribe(
      response => {
        this.gridData = response['Data'];
        this.countData = response['Count'];
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
        this.global.displayError(error);
      }
    );
  }

  handleClick(item) {
    this.cargarDatosSeguimiento(item);
    this.cargarEvaluacionProveedor(item);
  }

  cargarDatosSeguimiento(item) {
    this.spinner.show();
    this.itemEdit = item;
    this.seguimiento13Service.getSeguimientoOdoo13(item.lic_id, item.lic_det_id, item.prod_id, this.dataBaseFilter).subscribe(
      response => {
        let _detail = response['detail'];
        if (_detail.length > 0) {
          this.itemEdit.approved = _detail[0].aprobado;
          this.itemEdit.date_approved = _detail[0].date_approved;
          this.itemEdit.po_number = _detail.map(x => x.po).join('\n'); // _detail[0].po;
          this.itemEdit.proveedor = _detail[0].proveedor;
          this.itemEdit.cc_name = _detail[0].cc_name;
          this.itemEdit.po_qty = _detail.reduce((prev, cur) => { return prev + Number(cur.po_qty); }, 0); // _detail[0].po_qty;
          this.itemEdit.date_order = _detail[0].date_order;
          this.itemEdit.saldo_pedir = this.itemEdit.cantidad - this.itemEdit.po_qty;
          this.formEditGeneral.controls['authorized'].setValue(item.status === 'aprobado');
        }
        this.loadDataTracing(item, response['tracing'], response['product']);
        this.itemEdit.stock_almacen = (response['product']) ? response['product'].stock_now : 0;
        this.itemEdit.pendiente_aten = (response['product']) ? (response['product'].stock_max - response['product'].stock_now) : 0;
        this.displayEdit = true;
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
        this.global.showNotification(error, 'danger');
      }
    )
  }

  cargarDatosSeguimientoCheck(item) {
    this.itemEdit = item;
    this.seguimiento13Service.getSeguimientoOdoo13(item.lic_id, item.lic_det_id, item.prod_id, this.dataBaseFilter).subscribe(
        response => {
          let _detail = response['detail'];
          if (_detail.length > 0) {
            this.itemEdit.approved = _detail[0].aprobado;
            this.itemEdit.date_approved = _detail[0].date_approved;
            this.itemEdit.po_number = _detail.map(x => x.po).join('\n'); // _detail[0].po;
            this.itemEdit.proveedor = _detail[0].proveedor;
            this.itemEdit.cc_name = _detail[0].cc_name;
            this.itemEdit.po_qty = _detail.reduce((prev, cur) => { return prev + Number(cur.po_qty); }, 0); // _detail[0].po_qty;
            this.itemEdit.date_order = _detail[0].date_order;
            this.itemEdit.saldo_pedir = this.itemEdit.cantidad - this.itemEdit.po_qty;
            //this.formEditGeneral.controls['authorized'].setValue(item.status === 'aprobado');
          }
          this.itemEdit.stock_almacen = (response['product']) ? response['product'].stock_now : 0;
          this.itemEdit.pendiente_aten = (response['product']) ? (response['product'].stock_max - response['product'].stock_now) : 0;
          this.spinner.hide();
        }, error => {
          this.spinner.hide();
          this.global.showNotification(error, 'danger');
        }
    )
  }

  /// EVALUACION PROVEEDOR
  addItemEval() {
    let newItem = {
      lic_det_id: this.itemEdit.lic_det_id,
      company: this.dataBaseFilter,
      evalution_code: (this.codigo_eval) ? this.codigo_eval : '',
      supplier_ruc: '',
      supplier_name: '',
      qty: this.itemEdit.cantidad,
      unit_price: 0,
      total: 0,
      coin: 'USD',
      avg_estimated: 0,
      value_estimated: 0,
      product_id: this.itemEdit.prod_id,
      product_description: this.itemEdit.descripcion,
      description: '',
      create_user: this.identity.strUsuario,
      status: false,
      lista_detalle: JSON.parse(JSON.stringify(this.dataCriterios))
    }
    this.dataEvaluacion.push(newItem);
  }
  deleteItemEval(item) {
    const FLAG = confirm('Desea quitar esta evaluacion ?');
    if (FLAG) {
      this.dataEvaluacion = this.dataEvaluacion.filter(x => x !== item);
    }
  }
  cargarEvaluacionProveedor(item) {
    this.dataCriterios = this.criterioService.searchCriterios();
    this.evaluationService.searchEvaluations(item.lic_det_id, this.dataBaseFilter).subscribe(
      response => {
        this.dataEvaluacion = this.parseDataEval(this.dataCriterios, response['Data']);
      }, error => {
        this.global.displayError(error);
      }
    )
  }
  parseDataEval(crits, evals) {
    let data = JSON.parse( JSON.stringify( evals ) );
    this.minValueEstimated = data.filter(x => x.status === true).map(y => y.total);
    this.codigo_eval = '';
    for (let index = 0; index < data.length; index++) {
      if (index === 0) { this.codigo_eval = data[index].evalution_code; }
      data[index].lista_detalle = this.criterioService.searchCriterios(JSON.parse(data[index].list_detail)); // JSON.parse(data[index].list_detail);
      data[index].lic_det_id = this.itemEdit.lic_det_id;
      data[index].qty = this.itemEdit.cantidad;
      data[index].product_id = this.itemEdit.prod_id;
      data[index].product_description = this.itemEdit.descripcion;
      data[index].create_user = this.identity.strUsuario;
    }
    return data;
  }
  getAverage(item) {
    let data = item.lista_detalle;
    let sum = data.reduce((prev, cur) => { return prev + Number(cur.value); }, 0);
    item.avg_estimated = (sum + item.value_estimated * 100) / (data.length + 1);
  }
  getTotal(item) {
    item.total = Number(item.unit_price) * this.itemEdit.cantidad;
    this.changePercentage();
    // this.getAverage(item);
  }
  changePercentage() {
    let _totals = this.dataEvaluacion.map(item => item.total);
    this.minValueEstimated = Math.min.apply(null, _totals);
    for (let i = 0; i < this.dataEvaluacion.length; i++) {
      this.dataEvaluacion[i].status = (this.minValueEstimated === this.dataEvaluacion[i].total) ? true : false;
      this.dataEvaluacion[i].value_estimated = this.minValueEstimated / this.dataEvaluacion[i].total;
      this.getAverage(this.dataEvaluacion[i]);
    }
  }
  changeCodigoEval(codigo) {
    for (let i = 0; i < this.dataEvaluacion.length; i++) {
      this.dataEvaluacion[i].evalution_code = codigo;
    }
  }
  changeItemDetail(item) {
    if (item.code === 'C01' || item.code === 'C04') {
      let minimo = this.criterioService.getValorPorcCosto(item.code, this.dataEvaluacion);
      for (let i = 0; i < this.dataEvaluacion.length; i++) {
        let itemF = this.dataEvaluacion[i].lista_detalle.find(x => x.code === item.code);
        itemF.value = (Number(itemF.description) === 0) ? 100 : (minimo / Number(itemF.description)) * 100;
      }
    } else {
      item.value = this.criterioService.getValorPorcentage(item.code, item.description);
    }
    this.changePercentage();
  }
  saveEvaluation() {
    this.spinner.show();
    this.evaluationService.saveEvaluations(this.itemEdit.lic_det_id, this.dataEvaluacion).subscribe(
      response => {
        this.global.showNotification(response['message'], 'success');
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
        this.global.displayError(error);
      }
    )
  }
  handleSearchProveedor(item) {
    this.activeSearchSupp = item;
    this.formSearchSupp.patchValue({
      number: item.supplier_ruc,
      name: ''
    })
    this.searchProveedor();
    this.displaySearchSupp = true;
  }
  searchProveedor() {
    this.spinner.show();
    this.proveedorService.searchOdooPartners(this.formSearchSupp.value, 1, 10).subscribe(
      response => {
        this.dataSuppliers = response['Data'];
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
        this.global.displayError(error);
      }
    )
  }
  getProveedor(item) {
    this.activeSearchSupp.supplier_ruc = item.type_number;
    this.activeSearchSupp.supplier_name = item.name;
    this.displaySearchSupp = false;
  }
  // subir archivos
  fileChanged(e) {
    this.fileCharged = e.target.files[0];
  }
  uploadDocument() {
    if (!this.fileCharged) {
      this.global.showNotification('No se cargo ningun archivo', 'warning');
    } else {
      try {
        let fileReader = new FileReader();
        fileReader.onloadend = (e) => {
          let lines = fileReader.result.toString().split('\n');
          this.addItemEval();
          let _list_detail = [];
          let _unit_price = 0, _total_price = 0;
          for (let i = 0; i < lines.length; i++) {
            const items = lines[i].split(/[,;]/);
            if (items.length > 1) {
              let letter = items[1].substring(0, 1);
              if (letter === 'C' || letter === 'T') {
                let _idetail = {
                  code: items[1],
                  name: (items[2]) ? items[2] : '',
                  description: (items[3]) ? items[3].toUpperCase() : '',
                  type: (letter === 'C') ? 'Comercial' : 'Tecnica',
                  value: 0,
                  status: true,
                  // options: this.criterioService.getCuadro(items[1])
                }
                _idetail.value = this.criterioService.getValorPorcentage(_idetail.code, _idetail.description);
                _list_detail.push(_idetail);
              } else {
                if (items[1] === 'PU') {
                  _unit_price = Number(items[3]);
                  // _total_price = _unit_price * this.itemEdit.cantidad;
                } else {
                  _total_price = Number(items[3]);
                }
              }
            }
          }
          this.dataEvaluacion[this.dataEvaluacion.length - 1].unit_price = _unit_price;
          this.dataEvaluacion[this.dataEvaluacion.length - 1].total = _total_price;
          this.dataEvaluacion[this.dataEvaluacion.length - 1].lista_detalle = this.criterioService.searchCriterios(_list_detail);
          this.getTotal(this.dataEvaluacion[this.dataEvaluacion.length - 1]);
          // this.getAverage(this.dataEvaluacion[this.dataEvaluacion.length - 1]);
          this.displayUploadFile = false;
        }
        fileReader.readAsText(this.fileCharged);
      } catch (e) {
        this.global.showNotification('Error al cargar archivo', 'warning');
      }
    }
  }


  handleEvaluation() {
    let dataSelect = this.dataCheckSelected; // this.gridData.filter(x => x.check_seg === true);
    this.displayEvaluation = true;
  }

  // imprimir Evaluacion
  printEvaluation() {
    let data = this.dataEvaluacion;
    let criterios = (data.length > 0) ? data[0].lista_detalle : [];
    let doc = new jsPDF('l', 'mm', 'a4', true);
    doc.addImage(LOGO.logo_lajoya, 'PNG', 10, 10, 50, 15)
    doc.setFontSize(11);
    doc.text(105, 22, 'CUADRO COMPARATIVO:');
    doc.setFontType('bold');
    doc.text(160, 22, (data.length > 0) ? ('N° ' + data[0].evalution_code) : 'N°');
    doc.setFontSize(9);
    doc.text(30, 35, 'PRODUCTO:');
    doc.text(30, 40, 'CANTIDAD:');
    doc.setFontType('normal');
    doc.text(52, 35, this.itemEdit.descripcion);
    doc.text(52, 40, this.itemEdit.cantidad);
    doc.line(10, 27, 287, 27);

    let dataPrint = this.getDataPrint(data, criterios);
    doc.autoTable({
      head: dataPrint.head,
      body: dataPrint.body,
      startY: 45,
      styles: { fontSize: 7 },
      theme: 'grid'
    });
    doc.save('Evaluacion.pdf');
  }
  getDataPrint(data, criterios) {
    let rhead = [];
    let rbody = [];
    let sizeCol = data.length * 2 + 2, sizeRow = criterios.length;
    // cargar cebeceras
    for (let m = 0; m < 2; m++) {
      let iEval = 0;
      let arrHead = [];
      for (let n = 0; n < sizeCol; n++) {
        if ( m === 0) {
          if (n === 0) {
            arrHead.push('')
          } else if (n === 1) {
            arrHead.push('')
          } else {
            if (n % 2 === 0) {
              arrHead.push(data[iEval].supplier_name);
            } else {
              arrHead.push('');
              iEval++
            }
          }
        } else {
          if (n === 0) {
            arrHead.push('-');
          } else if (n === 1) {
            arrHead.push('DESCRIPCION PRODUCTO')
          } else {
            if (n % 2 === 0) {
              arrHead.push('TOTAL: ' + this.global.getNumberFix(data[iEval].total, 2));
            } else {
              arrHead.push(this.global.getPorcentageFix(data[iEval].value_estimated, 0));
              iEval++
            }
          }
        }
      }
      rhead.push(arrHead);
    }
    // cargar body
    for (let i = 0; i < sizeRow; i++) {
      let iEval = 0;
      let arrRow = [];
      const item = criterios[i];
      for (let j = 0; j < sizeCol; j++) {
        if (j === 0) {
          arrRow.push(item.code);
        } else if (j === 1) {
          arrRow.push(item.name);
        } else {
          let detail = data[iEval].lista_detalle;
          let item_detail = detail.find(x => x.code === item.code);
          if (j % 2 === 0) {
            arrRow.push(item_detail.description);
          } else {
            arrRow.push(item_detail.value + '%');
            iEval++
          }
        }
      }
      rbody.push(arrRow);
    }
    return { head : rhead, body: rbody};
  }


  loadDataTracing(item, tracing, product) {
    this.formEdit.reset();
    if (tracing) {
      this.idSegMongo = tracing._id;
      this.formEdit.patchValue({
        lic_id: tracing.lic_id,
        lic_name: tracing.lic_name,
        lic_det_id: tracing.lic_det_id,
        lic_date: tracing.lic_date,
        authorized: tracing.authorized,
        date2: tracing.date2,
        type: tracing.type,
        number_solpe: tracing.number_solpe,
        quoted: (tracing.quoted === 100) ? tracing.quoted : (tracing.number_solpe) ? 100 : 0,
        purchase: (tracing.purchase === 100) ? tracing.purchase : (this.itemEdit.saldo_pedir === 0 ? 100 : Math.round((this.itemEdit.cantidad - this.itemEdit.saldo_pedir) / this.itemEdit.cantidad) * 100),
        received: (tracing.received === 100) ? tracing.received : (tracing.guide) ? 100 : 0,
        sent: (tracing.sent === 100) ? tracing.sent : (tracing.guide) ? 100 : 0,
        guide: tracing.guide,
        send_date: tracing.send_date,
        urgent: tracing.urgent,
        period: tracing.period,
        area: tracing.area,
        company: tracing.company // Check
      });
    } else {
      this.idSegMongo = '-1';
      this.formEdit.patchValue({
        lic_id: item.lic_id,
        lic_name: item.lic_number,
        lic_det_id: item.lic_det_id,
        lic_date: item.lic_date,
        authorized: false,
        date2: '',
        type: '',
        number_solpe: '',
        quoted: 0,
        purchase: (this.itemEdit.saldo_pedir === 0 ? 100 : Math.round((this.itemEdit.cantidad - this.itemEdit.saldo_pedir) / this.itemEdit.cantidad) * 100),
        received: 0,
        sent: 0,
        guide: '',
        send_date: '',
        urgent: false,
        period: '',
        area: '',
        company: this.dataBaseFilter
      });
    }
  }

  // UPDATE ITEM SEGUIMIENTO
  updateSeguimiento() {
    let nro_solpe = (this.formEdit.value.number_solpe) ? this.generateSolpe(this.formEdit.value.number_solpe, this.itemEdit.lic_number) : '';
    let _quoted = (nro_solpe) ? 100 : this.formEdit.value.quoted;
    let _purchase = (this.itemEdit.saldo_pedir === 0 ? 100 : Math.round((this.itemEdit.cantidad - this.itemEdit.saldo_pedir) / this.itemEdit.cantidad) * 100); // ( this.itemEdit.po_number ) ? 100 : this.formEdit.value.purchase;
    let _received = (this.formEdit.value.guide) ? 100 : this.formEdit.value.received;
    let _sent = (this.formEdit.value.guide) ? 100 : this.formEdit.value.sent;
    this.formEdit.patchValue({
      number_solpe: nro_solpe,
      quoted: _quoted,
      purchase: _purchase,
      received: _received,
      sent: _sent,
      user_update: this.identity.strUsuario,
      date_update: new Date(),
      status: true });
    if (this.idSegMongo === '-1') {
      this.addSeguimiento(this.formEdit.value);
    } else {
      this.upSeguimiento(this.idSegMongo, this.formEdit.value);
    }
  }
  upSeguimiento(idSeg, Data) {
    this.spinner.show();
    this.seguimiento13Service.updateSeguimientoOdoo13(Data, idSeg).subscribe(
      response => {
        this.displayEdit = false;
        this.global.showNotification(response['message'], 'success');
        this.spinner.hide();
        this.searchOdooSeguimientos();
      }, error => {
        this.spinner.hide();
        this.global.displayError(error);
      }
    )
  }
  addSeguimiento(Data) {
    this.spinner.show();
    this.seguimiento13Service.insertSeguimientoOdoo13(Data).subscribe(
      response => {
        this.displayEdit = false;
        this.global.showNotification(response['message'], 'success');
        this.spinner.hide();
        this.searchOdooSeguimientos();
      }, error => {
        this.spinner.hide();
        this.global.displayError(error);
      }
    )
  }

  // GUARDADO GENERAL
  guardarGeneral() {
    this.spinner.show();
    let dataSelect = this.dataCheckSelected; // this.gridData.filter(x => x.check_seg === true);
    let promiss: any = [];
    for (let i = 0; i < dataSelect.length; i++) {
      const item = dataSelect[i];
      promiss.push(this.promiseGeneral(item));
    }
    Promise.all(promiss).then((results) => {
      this.spinner.hide();
      this.global.showNotification('Cambios guardados!', 'success');
      this.searchOdooSeguimientos();
      this.checkGeneral = false;
      this.formEditGeneral.reset();
      this.formEditGeneral.patchValue(this.obj_EditGeneral);
    });
  }
  promiseGeneral(item) {
    if (item.id_seg_mongo === '-1') {
      const seguimiento = this.loadItemSaveGeneral(item, this.formEditGeneral.value);
      return this.seguimiento13Service.insertSeguimientoOdoo13(seguimiento).subscribe(
        response => { return response; },
        error => {
          console.error(error.error.message, 'danger');
          return '-1';
        }
      )
    } else {
      let upSeguim = {
        authorized: (this.formEditGeneral.value.authorized) ? this.formEditGeneral.value.authorized : item.authorized,
        date2: (this.formEditGeneral.value.date2) ? this.formEditGeneral.value.date2 : item.date2,
        type: (this.formEditGeneral.value.type) ? this.formEditGeneral.value.type : item.type,
        number_solpe: (this.formEditGeneral.value.number_solpe) ? this.generateSolpe(this.formEditGeneral.value.number_solpe, item.lic_number) : item.number_solpe,
        guide: (this.formEditGeneral.value.guide) ? this.formEditGeneral.value.guide : item.guide,
        quoted: (this.formEditGeneral.value.number_solpe) ? 100 : 0,
        purchase: (this.formEditGeneral.value.purchase > 0) ? this.formEditGeneral.value.purchase : (this.formEditGeneral.value.purchase === 0 && item.po_name) ? 100 : item.purchase, // CHECK
        received: (this.formEditGeneral.value.received > 0) ? this.formEditGeneral.value.received : (this.formEditGeneral.value.received === 0 && this.formEditGeneral.value.guide) ? 100 : item.received,
        sent: (this.formEditGeneral.value.sent) ? this.formEditGeneral.value.sent : (this.formEditGeneral.value.sent === 0 && this.formEditGeneral.value.guide) ? 100 : item.sent,
        send_date: (this.formEditGeneral.value.send_date) ? this.formEditGeneral.value.send_date : item.send_date,
        period: item.lic_date,
        area: item.area_odoo,
        // company: this.dataBaseFilter,
        user_update: this.identity.strUsuario,
        date_update: new Date(),
        status: true
      }
      return this.seguimiento13Service.updateSeguimientoOdoo13(upSeguim, item.id_seg_mongo).subscribe(
        response => { return response; },
        error => {
          console.error(error.error.message, 'danger');
          return '-1';
        }
      )
    }
  }
  loadItemSaveGeneral(item, formGeneral) {
    return {
      lic_id: item.lic_id,
      lic_name: item.lic_number,
      lic_det_id: item.lic_det_id,
      lic_date: item.lic_date,
      authorized: formGeneral.authorized, // check
      date2: formGeneral.date2,
      type: (formGeneral.type), // check
      number_solpe: (formGeneral.number_solpe) ? this.generateSolpe(formGeneral.number_solpe, item.lic_number) : '', // check
      quoted: (formGeneral.number_solpe) ? 100 : 0,
      purchase: (formGeneral.purchase === 0 && item.po_name) ? 100 : formGeneral.purchase,
      received: (formGeneral.received === 0 && formGeneral.guide) ? 100 : formGeneral.received,
      sent: (formGeneral.sent === 0 && formGeneral.guide) ? 100 : formGeneral.sent,
      guide: (formGeneral.guide), // check
      send_date: formGeneral.send_date,
      urgent: false,
      period: item.lic_date,
      area: item.area_odoo,
      company: this.dataBaseFilter,
      user_update: this.identity.strUsuario,
      date_update: new Date(),
      status: true
    };
  }
  generateSolpe(value, number_lic) {
    if (value.length > 5) {
      return value;
    } else {
      let _solpe = `SOLP${number_lic}LOG00${value}LJM`;
      return _solpe;
    }
  }

  // CHECK TABLE
  changeCheckGeneral() {
    for (let i = 0; i < this.gridData.length; i++) {
      this.gridData[i].check_seg  = this.checkGeneral;
      if (this.checkGeneral) {
        let _find = this.dataCheckSelected.find(x => x.lic_det_id === this.gridData[i].lic_det_id);
        if(!_find) {
          this.checkAutorizado = this.gridData[i].state === 'aprobado';
          this.addSelectedItem(this.gridData[i]);
        }
      } else {
        this.deleteSelectedItem(this.gridData[i]);
      }
    }
    // this.showEditItems = ( this.checkGeneral ) ? true : false;
  }
  changeCheckItem(item) {
    if (item.check_seg) {
      let _find = this.dataCheckSelected.find(x => x.lic_det_id == item.lic_det_id);
      if (!_find) {
        console.log(item);
        //this.checkAutorizado = item.status === 'aprobado';
        this.formEditGeneral.controls['authorized'].setValue(item.state === 'aprobado');
        this.addSelectedItem(item);
        this.cargarDatosSeguimientoCheck(item);
      }
    } else {
      this.deleteSelectedItem(item);
    }
    // let dataSelect = this.gridData.filter(x => x.check_seg === true);
    // this.showEditItems = (dataSelect.length > 0) ? true : false;
    // this.dataCheckSelected = dataSelect;
  }
  addSelectedItem(item) {
    console.log(item);
    this.dataCheckSelected.push(item);
  }
  deleteSelectedItem(item) {
    this.dataCheckSelected =  this.dataCheckSelected.filter(x => x.lic_det_id !== item.lic_det_id);
  }

  // PAGINADO
  handlePage(e: any) {
    this.pageIndex = e.pageIndex + 1;
    this.pageSize = e.pageSize;
    this.searchOdooSeguimientos();
  }

  // EXPORTAR SEGUIMIENTO
  exportAsXLSX(): void {
    let data_result = this.gridData.map( item => ({
      'Nro Licitacion': item.lic_number,
      Fecha: item.lic_date,
      Solicitante: item.solicitante,
      Producto: '[' + item.prod_code + '] ' + item.prod_name,
      Descripcion: item.descripcion,
      Und: item.uom,
      'Cant. Solicitada': item.cantidad,
      'Saldo x Pedir': item.saldo_pedir,
      Estado: item.state,
      Autorizado: item.authorized,
      'Fecha Autorización': item.date2,
      PO: item.po_name,
      Tipo: item.type,
      Solpe: item.number_solpe,
      'Cotizado %': item.quoted,
      'Comprado %': item.purchase,
      'Recibido %': item.received,
      'Enviado %': item.sent,
      'Nro Guia': item.guide,
      'Fecha Envio': item.send_date
    }));
    this.excelService.exportAsExcelFile(data_result, 'SECOM');
  }
  exportFullData(): void {
    this.spinner.show();
    let data: any = {
      date_ini: this.formSearch.value.date_ini,
      date_fin: this.formSearch.value.date_fin,
      company_id: this.dataBaseFilter
    }
    this.seguimiento13Service.downloadOdoo13Seguimiento(data).subscribe(
      response => {
        let dataExport: any = response['Data'];
        let data_result = dataExport.map( item => ({
          'Nro Licitacion': item.lic_number,
          Fecha: item.lic_date,
          Solicitante: item.solicitante,
          Producto: '[' + item.prod_code + '] ' + item.prod_name,
          Descripcion: item.descripcion,
          Und: item.uom,
          'Cant. Solicitada': item.cantidad,
          'Saldo x Pedir': item.saldo_pedir,
          Estado: item.state,
          Autorizado: item.authorized,
          'Fecha Autorización': (item.date2) ? item.date2 : null,
          PO: (item.po_name) ? item.po_name : null,
          Tipo: (item.type) ? item.type : null,
          Solpe: (item.number_solpe) ? item.number_solpe : null,
          'Cotizado %': item.quoted,
          'Comprado %': item.purchase,
          'Recibido %': item.received,
          'Enviado %': item.sent,
          'Nro Guia': (item.guide) ? item.guide : null,
          'Fecha Envio': (item.send_date) ? item.send_date : null,
          'Compañia': item.company
        }));
        this.excelService.exportAsExcelFile(data_result, 'SECOM FULL');
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
        this.global.displayError(error);
      }
    );
  }

  // ENVIAR CORREO
  handleSendMail() {
    let dataSelect = this.dataCheckSelected; // this.gridData.filter(x => x.check_seg === true);
    let conc_msg = '';
    for (let i = 0; i < dataSelect.length; i++) {
      conc_msg += '- ' + this.global.getNumberFix(dataSelect[i].saldo_pedir, 2) + ' ' + dataSelect[i].uom + ' de ' + dataSelect[i].descripcion + '.\n';
    }
    let _message =
    `Estimados Señores\nLos invitamos a Participar en las Cotizaciones para las solicitudes de pedidos que tenemos en nuestra planta La Joya Mining SAC, adjunto los artículos para su cotización:\n\n${conc_msg}
    - Plazo Cierre de entrega de cotizaciones ${this.global.getParseDate(new Date)}.\n- Tener en cuenta que toda cotización tiene que tener algunos datos generales: Tiempo de entrega, Forma de Pago, Posibilidad de financiar el pago, Lugar de Entrega, Periodo de Garantía.\n\nGracias, estaremos atentos a sus comentarios.\n
    Saludos.`;
    let solpe_number = (dataSelect[0]) ? dataSelect[0].number_solpe : '';
    this.formEmail.patchValue({
      to: '',
      cc: this.identity.strEmail,
      subject: solpe_number,
      html: _message
    });
    this.displaySendEmail = true;
  }
  SendMail() {
    this.spinner.show();
    let email = {
      to: this.formEmail.value.to,
      cc: this.formEmail.value.cc,
      subject: this.formEmail.value.subject,
      html: this.formEmail.value.html.split('\n').join('<br />')
    }
    this.emailService.sendMail(email).subscribe(
      response => {
        this.spinner.hide();
        this.global.showNotification(response['message'], 'success');
        this.displaySendEmail = false;
      }, error => {
        this.spinner.hide();
        this.global.displayError(error);
      }
    )
  }

  // IMPRIMIR GUIA
  handleImprimirGuia() {
    this.formPrint.patchValue({date: this.global.getParseDate(new Date)});
    this.loadDataPrint();

    this.displayPrint = true;
  }

  imprimirGuia() {
    if (this.formPrint.valid) {
      // this.printService.printGuide(this.formPrint.value, this.dataPrint);
      // Promise.all([this.updateVariosSeguimientoOdoo13()]).then((results) => {
      //   this.printService.printGuide(this.formPrint.value, this.dataPrint);
      // });

      Promise.all([this.saveGuia(this.formPrint.value, this.dataPrint)]).then((results) => {
        this.printService.printGuide(this.formPrint.value, this.dataPrint);
      });
    }
  }
  loadDataPrint() {
    let dataSelect = this.dataCheckSelected; //this.gridData.filter(x => x.check_seg === true);
    this.dataPrint = [];
    for (let i = 0; i < 29 ; i++) {
      if (dataSelect[i]) {
        let number_po = (dataSelect[i].po_name) ? dataSelect[i].po_name.replaceAll(' ','-').replace(/\d+PO/g, '') : '';
        let lic_number = (dataSelect[i].lic_number) ? dataSelect[i].lic_number.replaceAll(' ','-').replace(/\LM-/g, '') : '';
        const item = {
          description: dataSelect[i].prod_name, // (dataSelect[i].prod_code) ? '[' + dataSelect[i].prod_code + '] ' + dataSelect[i].prod_name : dataSelect[i].prod_name,
          unit: dataSelect[i].uom.substring(0,2).toUpperCase(),
          qty: dataSelect[i].cantidad,
          purchase_order: number_po,
          number_lic: lic_number, // dataSelect[i].lic_number,
          lic_det_id: dataSelect[i].lic_det_id,
          id_seg_mongo: dataSelect[i].id_seg_mongo
        };
        this.dataPrint.push(item);
      } else {
        const item = {description: '', unit: '', number_lic: '', purchase_order: '', lic_det_id: null, id_seg_mongo: null};
        this.dataPrint.push(item);
      }
    }
  }

  updateVariosSeguimientoOdoo13() {
    this.spinner.show();
    let ids_seg = this.dataCheckSelected.filter(s => s.id_seg_mongo != '-1').map(x => x.id_seg_mongo);
    let data: any = {
      ids: ids_seg,
      guide: this.formPrint.value.number_guide.trim(),
      sent: 100
    };
    return this.seguimiento13Service.updateVariosSeguimientosOdoo13(data).subscribe(
      response => {
        this.spinner.hide();
        return response;
      }, error => {
        this.spinner.hide();
        this.global.displayError(error);
        return '-1';
      }
    );
  }

  saveGuia(dataGuide: any, detail: any) {
    if (this.formPrint.valid) {
      this.spinner.show();
      let data: any = JSON.parse(JSON.stringify(dataGuide));
      data.detail = detail.filter(x => x.description != '');
      this.guideService.saveGuide(data).subscribe(
        response => {
          this.spinner.hide();
          this.displayPrint = false;
          this.global.showNotification(response['message']);

          this.openDetailGuia(response['Data']);
        }, error => {
          this.spinner.hide();
          this.global.displayError(error);
        }
      );
    }
  }
  openDetailGuia(Data) {
    this.idDetailGuia = Data._id;
    this.displayDetailGuide = true;
  }
  closeDetailGuia() {
    this.displayDetailGuide = false;
    this.idDetailGuia = null;
  }

}
