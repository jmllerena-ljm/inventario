import { Component, OnInit } from '@angular/core';
import { AlmacenService } from '../../services/almacen.service';
import { GlobalService } from '../../services/Global';
import { ExcelService } from '../../services/excel.service';
import { CompanyService } from '../../services/company.service';
import { PeriodoIqbfService } from '../../services/periodoIqbf.service';

import { AccessControlModel, AccessControlService } from '../../services/accessControl.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-iqbf',
  templateUrl: './iqbf.component.html',
  styleUrls: ['./iqbf.component.scss']
})
export class IqbfComponent implements OnInit {
  identity: any = null;
  accessLevel: AccessControlModel = { Id: -1, NivelAcceso: false, Download: false, SuperUser: false };
  gridData: any = [];
  countData = 0;
  pageIndex = 1;
  pageSize = 50;
  formSearch: FormGroup;
  formEdit: FormGroup;
  formEditPeriodo: FormGroup;
  displayEdit: Boolean = false;
  displayEditPeriodo: Boolean = false;
  idEditStock = '';
  idEditPeriodo: any = -1; 
  itemEdit: any = {};
  dataCompany: any = [];
  daysToReset: Number = 0;
  pastDays: Number = 0;
  dataPeriodo: any = {};
  constructor(
    private almacenService: AlmacenService,
    private global: GlobalService,
    private spinner: NgxSpinnerService,
    private excelService: ExcelService,
    private companyService: CompanyService,
    private periodoIqbfService: PeriodoIqbfService,
    private accessControl: AccessControlService
  ) {
    this.formSearch = new FormGroup({
      code: new FormControl(''),
      name: new FormControl(''),
      group: new FormControl(''),
      type: new FormControl('none'),
      date_ini: new FormControl(''),
      date_fin: new FormControl(''),
      company: new FormControl(''),
      sort: new FormControl('code'),
    });
    this.formEdit = new FormGroup({
      audited: new FormControl(false, Validators.required),
      authorized_amount: new FormControl(0, Validators.required),
      update_user: new FormControl(''),
    });
    this.formEditPeriodo = new FormGroup({
      name: new FormControl(''),
      dateIni: new FormControl('', Validators.required),
      dateFin: new FormControl('', Validators.required)
    });
  }

  ngOnInit() {
    this.identity = this.global.getIdentity();
    if (this.identity === null) {
      this.global.goToLogin();
    } else {
      this.accessLevel = this.accessControl.checkAccess(this.identity.strUsuario, 'ACC-013');
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
        if(this.dataCompany.length > 0) {
          this.formSearch.patchValue({ company: this.dataCompany[0]._id });
          this.spinner.hide();
          this.getPeriodoIqbf();
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

  getPeriodoIqbf() {
    this.periodoIqbfService.getPeriodoIqbf().subscribe(
      response => {
        this.dataPeriodo = response['Data'];        
        if (this.dataPeriodo === null) {
          this.idEditPeriodo = -1;
          this.daysToReset = 0;
          this.pastDays = 0;
        } else {
          this.idEditPeriodo = this.dataPeriodo._id;
          let fechaActual = new Date().getTime();
          let fechaInicio = new Date(this.dataPeriodo.dateIni).getTime();
          let fechaFin = new Date(this.dataPeriodo.dateFin).getTime();
          let diffRest = fechaFin - fechaActual;
          let diffPast = fechaActual - fechaInicio;
          this.daysToReset = Math.round(diffRest/(1000*60*60*24));
          this.pastDays = Math.round(diffPast/(1000*60*60*24));
        }
        this.searchAlmacenIQBF();
      }, error => {
        this.global.displayError(error);
      }
    );
  }

  searchAlmacenIQBF() {
    this.spinner.show();
    this.formSearch.patchValue({
      date_ini: (this.dataPeriodo) ? this.dataPeriodo.dateIni : new Date(),
      date_fin: (this.dataPeriodo) ? this.dataPeriodo.dateFin : new Date()
    });
    this.almacenService.searchAlmacenIqbf(this.formSearch.value, this.pageIndex, this.pageSize).subscribe(
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
  handlePage(e: any) {
    this.pageIndex = e.pageIndex + 1;
    this.pageSize = e.pageSize;
    this.searchAlmacenIQBF();
  }

  handleEdit(item) {
    this.itemEdit = item;
    this.idEditStock = item._id;
    this.formEdit.patchValue({
      audited: (item.audited) ? item.audited : false,
      authorized_amount: (item.authorized_amount) ? item.authorized_amount : 0,
      update_user: this.identity.strUsuario,
    });
    this.displayEdit = true;
  }
  updateAlmacen() {
    this.spinner.show();
    let _item = this.formEdit.value;
    let _data = {
      audited: _item.audited,
      authorized_amount: _item.authorized_amount,
      update_user: _item.update_user,
    }

    this.almacenService.updateAlmacen(_data, this.idEditStock).subscribe(
      response => {
        this.displayEdit = false;
        this.spinner.hide();
        this.global.showNotification(response['message'], 'success');
        this.searchAlmacenIQBF();
      }, error => {
        this.global.displayError(error);
        this.spinner.hide();
      }
    );
  }

  handlEditPeriodo() {
    this.formEditPeriodo.patchValue({
      dateIni: (this.dataPeriodo) ? this.global.getParseDate(this.dataPeriodo.dateIni) : '',
      dateFin: (this.dataPeriodo) ? this.global.getParseDate(this.dataPeriodo.dateFin) : '',
    });
    this.displayEditPeriodo = true;
  }

  handleSave() {
    let data: any = {
      name: this.formEditPeriodo.value.dateIni + '/' + this.formEditPeriodo.value.dateFin,
      dateIni: this.formEditPeriodo.value.dateIni + 'T00:00:00',
      dateFin: this.formEditPeriodo.value.dateFin + 'T00:00:00',
    }
    if( this.idEditPeriodo === -1 ) {
      this.savePeriodo(data);
    } else {
      this.updatePeriodo(data);
    }
  }
  savePeriodo(data) {
    this.spinner.show();
    this.periodoIqbfService.savePeriodoIqbf(data).subscribe(
      response => {
        this.displayEditPeriodo = false;
        this.spinner.hide();
        this.global.showNotification(response['message'], 'success');
        this.getPeriodoIqbf();
      }, error => {
        this.global.displayError(error);
        this.spinner.hide();
      }
    );
  }

  updatePeriodo(data) {
    this.spinner.show();
    this.periodoIqbfService.updatePeriodoIqbf(data, this.idEditPeriodo).subscribe(
      response => {
        this.displayEditPeriodo = false;
        this.spinner.hide();
        this.global.showNotification(response['message'], 'success');
        this.getPeriodoIqbf();
      }, error => {
        this.global.displayError(error);
        this.spinner.hide();
      }
    );
  }

  exportAsXLSX(): void {
    let data_result = this.gridData.map( item => ({
      Codigo: item.code,
      Nombre: item.name,
      Und: item.umed,
      Tipo: item.group,
      entradas: item.entry,
      salidas: item.output,
      'Cant.Restante': item.authorized_amount
    }));
    this.excelService.exportAsExcelFile(data_result, 'Almacen_IQBF');
  }
}

