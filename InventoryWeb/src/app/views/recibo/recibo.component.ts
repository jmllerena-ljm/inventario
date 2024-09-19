import { Component, OnInit } from '@angular/core';
import { ReciboService } from '../../services/recibo.service';
import { FirmaService } from '../../services/firma.service';
import { GlobalService } from '../../services/Global';
import { AccessControlModel, AccessControlService } from '../../services/accessControl.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import jsPDF from 'jspdf';
import { NumerosALetras } from 'numero-a-letras';
import * as LOGO from '../../../assets/img/logo_ljm';

@Component({
  selector: 'app-recibo',
  templateUrl: './recibo.component.html',
  styleUrls: ['./recibo.component.css']
})
export class ReciboComponent implements OnInit {
  identity: any = null;
  accessLevel: AccessControlModel = { Id: -1, NivelAcceso: false, Download: false, SuperUser: false };
  gridData: any = [];
  countData = 0;
  pageIndex = 1;
  pageSize = 25;
  displayAdd: Boolean = false;
  displayDetail: Boolean = false;
  formCreate: FormGroup;
  formSearch: FormGroup;
  formEdit: FormGroup;
  dataCompany: any = [
    { value: 'LJM', name: 'La Joya Mining SAC' },
    { value: 'LJC', name: 'La Joya Comercial SAC' },
    { value: 'LCC', name: 'La Joya Concesiones SAC' },
    { value: 'IMX', name: 'Inversiones MAXPI EIRL' },
    { value: 'LJE', name: 'Asoc.Civil La Joya Esperanza' },
    { value: 'QH', name: 'QHUYA' },
    { value: 'BED', name: 'BEDUINOS'}
  ];
  dataCurrency: any = [
    { value: 'PEN', name: 'Soles' },
    { value: 'USD', name: 'Dolares' },
  ];
  perAutoriza: String = '';
  perSolicita: String = '';
  formDetail: any = {};
  codeAuthorized_edit = '';
  idAuthorized_edit = '-1';
  check_authorized = false;
  constructor(
    private reciboService: ReciboService,
    private firmaService: FirmaService,
    private accessControl: AccessControlService,
    private global: GlobalService,
    private spinner: NgxSpinnerService
  ) {
    this.formSearch = new FormGroup({
      code: new FormControl(''),
      company: new FormControl(''),
    })
    this.formCreate = new FormGroup({
      name: new FormControl(''),
      company: new FormControl('', Validators.required),
      date: new FormControl(new Date(), Validators.required),
      user_request: new FormControl('', Validators.required),
      amount_number: new FormControl(0, Validators.required),
      amount_text: new FormControl('', Validators.required),
      currency: new FormControl('', Validators.required),
      concept: new FormControl('', Validators.required),
      account: new FormControl(''),
      operation: new FormControl(''),
      create_user: new FormControl(''),
      // firm_authorize: new FormControl(''),
      firm_request: new FormControl('', Validators.required),
      // code_authorized: new FormControl(''),
      code_request: new FormControl('')
    });
    this.formEdit = new FormGroup({
      company: new FormControl('', Validators.required),
      date: new FormControl(new Date(), Validators.required),
      user_request: new FormControl('', Validators.required),
      amount_number: new FormControl(0, Validators.required),
      amount_text: new FormControl('', Validators.required),
      currency: new FormControl('', Validators.required),
      concept: new FormControl('', Validators.required),
    });
  }

  ngOnInit() {
    this.identity = this.global.getIdentity();
    if (this.identity === null) {
      this.global.goToLogin();
    } else {
      this.accessLevel = this.accessControl.checkAccess(this.identity.strUsuario, 'ACC-005');
      if (this.accessLevel) {
        this.bind();
      }
    }
  }

  bind() {
    this.searchRecibos();
  }
  // BUSQUEDA
  searchRecibos() {
    this.spinner.show();
    this.reciboService.searchRecibos(this.formSearch.value, this.pageIndex, this.pageSize).subscribe(
      response => {
        this.gridData = response['Data'];
        this.countData = response['Count'];
        this.spinner.hide();
      }, error => {
        this.global.displayError(error);
        this.spinner.hide();
      }
    );
  }

  handleAdd() {
    this.perAutoriza = 'Sin Autorizacion';
    this.perSolicita = 'Sin Autorizacion';
    this.formCreate.patchValue({
      name: 'RECIBO DE EGRESOS',
      company: 'La Joya Mining SAC',
      date: this.global.getParseDate(new Date()),
      user_request: this.identity.strNombre,
      amount_number: 0,
      amount_text: '',
      currency: 'PEN',
      concept: '',
      account: '',
      operation: '',
      create_user: this.identity.strNombre,
      firm_authorize: '',
      firm_request: '',
      code_request: ''
    });
    this.displayAdd = true;
  }
  saveRecibo() {
    this.spinner.show();
    this.reciboService.saveRecibo(this.formCreate.value).subscribe(
      response => {
        this.displayAdd = false;
        this.global.showNotification(response['message'], 'success');
        this.searchRecibos();
        this.spinner.hide();
      }, error => {
        this.global.displayError(error);
        this.spinner.hide();
      }
    )
  }
  authorizedRecibo() {
    this.spinner.show();
    let data = {
      state: 'autorizado',
      firm_authorize: this.idAuthorized_edit
    }
    this.reciboService.updateRecibo(this.formDetail._id, data).subscribe(
      response => {
        this.displayDetail = false;
        this.global.showNotification(response['message']);
        this.searchRecibos();
        this.spinner.hide();
      }, error => {
        this.global.displayError(error);
        this.spinner.hide();
      }
    )
  }
  printRecibo() {
    this.spinner.show();
    let firm_solicita = this.formDetail.firm_request;
    let firm_autoriza = this.formDetail.firm_authorize;
    let _path = this.global.getUrl() + 'firma/get-image/'
    let img_solicita = new Image();
    img_solicita.src = _path + firm_solicita.image;
    let img_autoriza = new Image();
    img_autoriza.src = _path + firm_autoriza.image;

    let name_logo = (this.formDetail.company === 'La Joya Mining SAC') ? 'logo_mining.jpg'
      : (this.formDetail.company === 'La Joya Comercial SAC') ? 'logo_comercial.jpg'
      : (this.formDetail.company === 'La Joya Concesiones SAC') ? 'logo_concesiones.jpg'
      : (this.formDetail.company === 'Asoc.Civil La Joya Esperanza') ? 'logo_esperanza.jpg'
      : (this.formDetail.company === 'QHUYA') ? 'logo_qhuya.jpeg'
      : (this.formDetail.company === 'BEDUINOS') ? 'logo_beduinos.jpeg' : 'logo_invmaxpi.jpeg';
    let img_empresa = new Image();
    img_empresa.src = 'assets/img/' + name_logo;

    let doc = new jsPDF('p', 'mm', 'a4', true);
    doc.addImage(img_empresa, 'PNG', 10, 10, 40, 12)
    doc.setFontSize(14);
    doc.setFontType('bold')
    doc.text(82, 18, 'RECIBO DE EGRESOS');

    doc.setTextColor(255, 0, 0);
    doc.text(175, 18, 'N° ' + this.formDetail.code);
    doc.rect(150, 25, 50, 7);
    doc.rect(150, 32, 50, 7);
    doc.rect(10, 75, 50, 7);
    doc.rect(10, 82, 50, 20);

    doc.setTextColor(0, 0, 0); // Negro
    doc.setFontSize(10);
    doc.text(10, 35, 'Fecha:');
    doc.text(10, 43, 'Solicita:');
    doc.text(10, 51, 'Monto:');
    doc.text(10, 59, 'Concepto:');
    doc.text(152, 30, 'S/');
    doc.text(152, 37, 'US$');
    doc.text(28, 80, 'CAJA');
    doc.text(12, 88, 'Cta.');
    doc.text(12, 95, '# Op.');
    doc.setFontType('normal');
    doc.text(35, 35, new Date(this.formDetail.date).toLocaleDateString());
    doc.text(35, 43, this.formDetail.user_request.toString());
    doc.text(35, 51, this.formDetail.amount_text.toString());
    doc.text(35, 59, doc.splitTextToSize(this.formDetail.concept.toString(), 170));
    doc.text(25, 88, this.formDetail.account.toString());
    doc.text(25, 95, this.formDetail.operation.toString());

    doc.line(70, 92, 120, 92);
    doc.line(150, 92, 200, 92);
    doc.text(75, 97, 'Autoriza: ' + this.perAutoriza);
    doc.text(90, 103, 'V°B°');
    doc.text(155, 97, 'Solicita: ' + this.perSolicita);
    doc.text(170, 103, 'V°B°');

    doc.addImage(img_autoriza, 'PNG', 70, 75, 50, 20);
    doc.addImage(img_solicita, 'PNG', 150, 75, 50, 20);

    if (this.formDetail.currency === 'PEN') {
      doc.text(163, 30, this.global.getNumberFormatFix(this.formDetail.amount_number, 2));
    } else {
      doc.text(163, 37, this.global.getNumberFormatFix(this.formDetail.amount_number, 2));
    }

    this.spinner.hide();
    doc.save('Recibo Nro-' + this.formDetail.code + '.pdf');
  }

  getFirma(code: string, type: string) {
    this.firmaService.getFirma(code).subscribe(
      response => {
        if (type === 'authorized') {
          if (response['data'] === null) {
            this.perAutoriza = 'Sin Autorizacion';
            // this.formDetail.patchValue({ firm_authorize: '' });
          } else {
            if (response['data'].type === 'Autoriza') {
              this.perAutoriza = response['data'].name;
              this.idAuthorized_edit = response['data']._id;
            } else {
              this.idAuthorized_edit = '-1';
              this.perAutoriza = 'Este usuario no puede autorizar';
            }
          }
        } else {
          if (response['data'] === null) {
            this.perSolicita = 'Sin Autorizacion';
            this.formCreate.patchValue({ firm_request: '' });
          } else {
            this.perSolicita = response['data'].name;
            this.formCreate.patchValue({ firm_request: response['data']._id })
          }
        }
      }, error => {
        this.global.displayError(error);
      }
    )
  }


  onSelected(id_item) {
    this.spinner.show();
    this.formDetail = {};
    this.reciboService.getRecibo(id_item).subscribe(
      response => {
        this.formDetail = response['Data'];
        this.ValidateEdit();
        this.perSolicita = this.formDetail.firm_request.name;
        if (this.formDetail.firm_authorize) {
          this.perAutoriza = this.formDetail.firm_authorize.name;
          this.check_authorized = true;
        } else {
          this.perAutoriza = 'Sin Autorizacion';
          this.check_authorized = false;
        }
        this.displayDetail = true;
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
        this.global.displayError(error);
      }
    )
  }
  ValidateEdit() {
    this.formEdit.patchValue({
      company: this.formDetail.company,
      date: this.global.getParseDate(this.formDetail.date),
      user_request: this.formDetail.user_request,
      amount_number: this.formDetail.amount_number,
      amount_text: this.formDetail.amount_text,
      currency: this.formDetail.currency,
      concept: this.formDetail.concept,
    });
    if (this.formDetail.state !== 'borrador') {
      this.formEdit.disable();
    } else {
      this.formEdit.enable();
    }
  }
  updateRecibo() {
    this.spinner.show();
    this.reciboService.updateRecibo(this.formDetail._id, this.formEdit.value).subscribe(
      response => {
        this.displayDetail = false;
        this.global.showNotification(response['message'], 'success');
        this.searchRecibos();
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
        this.global.displayError(error);
      }
    )
  }

  // Anular Recibo
  deleteRecibo() {
    this.spinner.show();
    const FLAG = confirm(`Desea Anular el recibo: ${ this.formDetail.code } ?`);
    if (FLAG) {
      this.reciboService.deleteRecibo(this.formDetail._id).subscribe(
        response => {
          this.displayDetail = false;
          this.global.showNotification(response['message'], 'success');
          this.searchRecibos();
          this.spinner.hide();
        }, error => {
          this.spinner.hide();
          this.global.displayError(error);
        }
      );
    }
  }
  changeAmount(Forma) {
    let texto = NumerosALetras(Forma.value.amount_number).toString().toUpperCase();
    let moneda = (Forma.value.currency==='PEN')?' SOLES':' DOLARES';
    Forma.patchValue({
      amount_text: texto + moneda
    });
  }

  handlePage(e: any) {
    this.pageIndex = e.pageIndex + 1;
    this.pageSize = e.pageSize;
    this.searchRecibos();
  }
}
