import { Component, OnInit } from '@angular/core';
import { AlmacenService } from '../../services/almacen.service';
import { EntradasService } from '../../services/entradas.service';
import { GlobalService } from '../../services/Global';
import { ExcelService } from '../../services/excel.service';
import { EmailService } from '../../services/email.service';
import { CompanyService } from '../../services/company.service';
import { AccessControlModel, AccessControlService } from '../../services/accessControl.service';
import { FormGroup, FormControl, Validators, FormControlName } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-reposicion',
  templateUrl: './reposicion.component.html',
  styleUrls: ['./reposicion.component.scss']
})
export class ReposicionComponent implements OnInit {
  identity: any = null;
  accessLevel: AccessControlModel = { Id: -1, NivelAcceso: false, Download: false, SuperUser: false };
  gridData: any = [];
  formSearch: FormGroup;
  formEdit: FormGroup;
  formEmail: FormGroup;
  displayEdit: Boolean = false;
  displayDetalle: Boolean = false;
  displaySendEmail: Boolean = false;
  idEditStock: '';
  detalleProducto: any = [];
  ultimaLicitacion: String = '';
  selectColor: any = [
    {id: 1, value: 'red', name: 'Rojo'},
    {id: 2, value: 'yellow', name: 'Amarillo'},
    {id: 3, value: 'green', name: 'Verde'},
    {id: 4, value: 'purple', name: 'Morado'},
  ];
  selectType: any = [
    {id: 1, value: 'none', name: 'Almacen'},
    {id: 2, value: 'replacement', name: 'Reposiciones'}
  ];
  selectOrderBy: any = [
    {value: 'code', name: 'Codigo'},
    {value: 'name', name: 'Nombre'}
  ];
  checkGeneral: Boolean = false;
  dataCompany: any = [];
  check_asc: Boolean = true;
  constructor(
    private almacenService: AlmacenService,
    private entradaService: EntradasService,
    private global: GlobalService,
    private spinner: NgxSpinnerService,
    private excelService: ExcelService,
    private emailService: EmailService,
    private companyService: CompanyService,
    private accessControl: AccessControlService,
  ) {
    this.formSearch = new FormGroup({
      color: new FormControl(''),
      code: new FormControl(''),
      name: new FormControl(''),
      group: new FormControl(''),
      type: new FormControl('replacement'),
      company: new FormControl(''),
      columnSort: new FormControl('code'),
      sort: new FormControl(''),
    });
    this.formEdit = new FormGroup({
      code: new FormControl(''),
      name: new FormControl(''),
      group: new FormControl(''),
      umed: new FormControl(''),
      type: new FormControl('', Validators.required),
      stock_security: new FormControl(0, Validators.required),
      stock_min: new FormControl(0, Validators.required),
      stock_max: new FormControl(0, Validators.required),
      update_user: new FormControl('')
    });
    this.formEmail = new FormGroup({
      cc: new FormControl(''),
      to: new FormControl('', Validators.required),
      subject: new FormControl('', Validators.required),
      html: new FormControl('', Validators.required)
    });
  }

  ngOnInit() {
    this.identity = this.global.getIdentity();
    if (this.identity === null) {
      this.global.goToLogin();
    } else {
      this.accessLevel = this.accessControl.checkAccess(this.identity.strUsuario, 'ACC-001');
      if (this.accessLevel) {
        this.bind();
      }
    }
  }
  bind() {
    this.searchCompanies();
  }

  // SEARCH COMPANIES
  searchCompanies() {
    this.spinner.show();
    let data: any = { name: '' };
    this.companyService.searchCompanies(data).subscribe(
      response => {
        this.dataCompany = response;
        if (this.dataCompany.length > 0) {
          this.formSearch.patchValue({ company: this.dataCompany[0]._id });
          this.spinner.hide();
          this.searchAlmacen();
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

  searchAlmacen() {
    this.spinner.show();
    const pageSize = 10;
    const page = 1;
    let _sort: string = (this.check_asc == true ? '' : '-') + this.formSearch.value.columnSort;
    this.formSearch.patchValue({ sort: _sort });
    this.almacenService.getAlmacen(this.formSearch.value, page, pageSize).subscribe(
      response => {
        this.gridData = response['Data'];
        this.spinner.hide();
      }, error => {
        this.global.displayError(error);
        this.spinner.hide();
      }
    );
  }

  handleClick(item) {
    this.entradaService.getDetalleProducto(item.product_id, this.formSearch.value.company).subscribe(
      response => {
        this.detalleProducto = response['Data'];
        this.ultimaLicitacion = response['lic_number'];
        this.displayDetalle = true;
      }, error => {
        this.global.displayError(error, false);
      }
    )
  }

  handleEdit(item) {
    this.idEditStock = item._id;
    this.formEdit.patchValue({
      code: item.code,
      name: item.name,
      group: item.group,
      umed: item.umed,
      type: item.type,
      stock_security: item.stock_security,
      stock_min: item.stock_min,
      stock_max: item.stock_max,
      update_user: this.identity.strUsuario
    });
    this.displayEdit = true;
  }
  updateAlmacen() {
    this.spinner.show();
    let _item = this.formEdit.value;
    let _data = {
      stock_security: _item.stock_security,
      stock_min: _item.stock_min,
      stock_max: _item.stock_max,
      group: _item.group,
      umed: _item.umed,
      type: _item.type,
      update_user: _item.update_user
    }
    this.almacenService.updateAlmacen(_data, this.idEditStock).subscribe(
      response => {
        this.displayEdit = false;
        this.global.showNotification(response['message'], 'success');
        this.spinner.hide();
        this.searchAlmacen();
      }, error => {
        this.global.displayError(error);
        this.spinner.hide();
      }
    );
  }

  exportAsXLSX(): void {
    let data_result = this.gridData.map(item => ({
      Codigo: item.code,
      Nombre: item.name,
      Und: item.umed,
      Tipo: item.group,
      Estado: item.color,
      Sseg: item.stock_security,
      Smin: item.stock_min,
      Smax: item.stock_max,
      Sactual: item.stock_now
    }));
    this.excelService.exportAsExcelFile(data_result, 'Reposiciones');
  }

  changeCheckGeneral() {
    for (let i = 0; i < this.gridData.length; i++) {
      this.gridData[i].check  = this.checkGeneral;
    }
  }
  SumData(data, type) {
    return data.filter(x => x.type === type).reduce((prev, cur) => { return prev + Number(cur.product_qty); }, 0)
  }

  // ENVIAR EMAIL PROVEEDOR
  handleSendMail() {
    let dataSelect = this.gridData.filter(x => x.check === true);
    let conc_msg = '';
    for (let i = 0; i < dataSelect.length; i++) {
      // conc_msg += '<li>' + this.getNumberFix(dataSelect[i].replenish, 2) + ' ' + dataSelect[i].umed + ' de <b>' + dataSelect[i].name + '.</b></li>';
      conc_msg += '- ' + this.getNumberFix(dataSelect[i].replenish, 2) + ' ' + dataSelect[i].umed + ' de ' + dataSelect[i].name + '.\n';
    }
    // let _message =
    // `Estimados Señores<br><br>
    // Los invitamos a Participar en las Cotizaciones para las solicitudes de pedidos que tenemos en nuestra
    // planta <b>La Joya Mining SAC</b>, adjunto los artículos para su cotización:<br>
    //   <ul>
    //     ${conc_msg}
    //   </ul>
    //   <ul>
    //     <li>Plazo Cierre de entrega de cotizaciones <b>${this.global.getParseDate(new Date)}</b>.
    //     <li>Tener en cuenta que toda cotización tiene que tener algunos datos generales: Tiempo de entrega, Forma de Pago, Posibilidad de financiar el pago, Lugar de Entrega, Periodo de Garantía.</li>
    //   </ul>
    // Gracias, estaremos atentos a sus comentarios.
    // <br><br>
    // Saludos.`;
    let _message =
    `Estimados Señores\nLos invitamos a Participar en las Cotizaciones para las solicitudes de pedidos que tenemos en nuestra planta La Joya Mining SAC, adjunto los artículos para su cotización:\n\n${conc_msg}
    - Plazo Cierre de entrega de cotizaciones ${this.global.getParseDate(new Date)}.\n- Tener en cuenta que toda cotización tiene que tener algunos datos generales: Tiempo de entrega, Forma de Pago, Posibilidad de financiar el pago, Lugar de Entrega, Periodo de Garantía.\n\nGracias, estaremos atentos a sus comentarios.\n
    Saludos.`;

    this.formEmail.patchValue({
      to: '',
      cc: this.identity.strEmail,
      subject: 'Speech - Compras',
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
      html: this.formEmail.value.html.split('\n').join('<br/>')
    }
    this.emailService.sendMail(email).subscribe(
      response => {
        this.spinner.hide();
        this.global.showNotification(response['message'], 'success');
        this.displaySendEmail = false;
      }, error => {
        this.global.displayError(error);
        this.spinner.hide();
      }
    )
  }
  getNumberFix(number, fix: number) {
    if (number === '' || number === null || number === undefined) {
      return '';
    } else {
      return parseFloat(number).toFixed(fix);
    }
  }
}
