import { Component, OnInit } from '@angular/core';
import { AlmacenService } from '../../services/almacen.service';
import { EntradasService } from '../../services/entradas.service';
import { GlobalService } from '../../services/Global';
import { ExcelService } from '../../services/excel.service';
import { CompanyService } from '../../services/company.service';
import { AccessControlModel, AccessControlService } from '../../services/accessControl.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-almacen',
  templateUrl: './almacen.component.html',
  styleUrls: ['./almacen.component.css']
})
export class AlmacenComponent implements OnInit {
  identity: any = null;
  accessLevel: AccessControlModel = { Id: -1, NivelAcceso: false, Download: false, SuperUser: false };
  gridData: any = [];
  countData = 0;
  pageIndex = 1;
  pageSize = 50;
  formSearch: FormGroup;
  formEdit: FormGroup;
  displayEdit: Boolean = false;
  displayDetalle: Boolean = false;
  idEditStock: '';
  itemEdit: any = {};
  detalleProducto: any = [];
  detalleProductoPrecio: any = [];
  idxTab = 0;
  selectType: any = [
    {id: 1, value: 'none', name: 'Almacen'},
    {id: 2, value: 'replacement', name: 'Reposiciones'}
  ]
  dataCompany: any = [];
  selectOrderBy: any = [
    {value: 'code', name: 'Codigo'},
    {value: 'name', name: 'Nombre'}
  ];
  check_asc: boolean = true;
  dataHistorial: any = [];
  constructor(
    private almacenService: AlmacenService,
    private entradaService: EntradasService,
    private global: GlobalService,
    private spinner: NgxSpinnerService,
    private excelService: ExcelService,
    private companyService: CompanyService,
    private accessControl: AccessControlService
  ) {
    this.formSearch = new FormGroup({
      code: new FormControl(''),
      name: new FormControl(''),
      group: new FormControl(''),
      type: new FormControl('none'),
      company: new FormControl(''),
      columnSort: new FormControl('code'),
      sort: new FormControl(''),
    });
    this.formEdit = new FormGroup({
      code: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      group: new FormControl(''),
      umed: new FormControl(''),
      stock_ini: new FormControl(0, Validators.required),
      type: new FormControl('', Validators.required),
      audited: new FormControl(false, Validators.required),
      authorized_amount: new FormControl(0, Validators.required),
      status: new FormControl(false),

      stock_security: new FormControl(0),
      stock_min: new FormControl(0),
      stock_max: new FormControl(0)
    });
  }

  ngOnInit() {
    this.identity = this.global.getIdentity();
    if (this.identity === null) {
      this.global.goToLogin();
    } else {
      this.accessLevel = this.accessControl.checkAccess(this.identity.strUsuario, 'ACC-002');
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
    let _sort: string = (this.check_asc == true ? '' : '-') + this.formSearch.value.columnSort;
    this.formSearch.patchValue({ sort: _sort });
    this.almacenService.getAlmacen(this.formSearch.value, this.pageIndex, this.pageSize).subscribe(
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
  getHistorialChangesAlmacen(idAlmacen: string) {
    this.almacenService.getHistorialChanges(idAlmacen).subscribe(
      response => {
        this.dataHistorial = response['Data'];
      }, error => {
        this.global.displayError(error);
      }
    );
  }


  handlePage(e: any) {
    this.pageIndex = e.pageIndex + 1;
    this.pageSize = e.pageSize;
    this.searchAlmacen();
  }

  handleClick(item) {
    this.detalleProducto = [];
    this.detalleProductoPrecio = [];
    this.entradaService.getDetalleProducto(item.product_id, this.formSearch.value.company).subscribe(
      response => {
        this.detalleProducto = response['Data'];
        this.displayDetalle = true;
      }, error => {
        this.global.displayError(error);
      }
    )
    let _date = new Date();
    let _query = {
      product_id: item.product_id,
      date: this.global.getParseDate(new Date(_date.getFullYear() - 1, _date.getMonth(), _date.getDate())),
      company: this.formSearch.value.company
    }
    this.entradaService.getOdooProductoPrecio(_query).subscribe(
      success => {
        this.detalleProductoPrecio = success['Data'];
      }, error => {
        this.global.displayError(error);
      }
    )
  }

  handleEdit(item) {
    this.itemEdit = item;
    this.idEditStock = item._id;
    this.getHistorialChangesAlmacen(this.idEditStock);
    this.formEdit.reset();
    this.formEdit.patchValue({
      code: item.code,
      name: item.name,
      group: item.group,
      umed: item.umed,
      type: item.type,
      audited: (item.audited) ? item.audited : false,
      authorized_amount: (item.authorized_amount) ? item.authorized_amount : 0,
      stock_ini: item.stock_ini,
      stock_security: item.stock_security,
      stock_min: item.stock_min,
      stock_max: item.stock_max,
      status: item.status
    });
    this.displayEdit = true;
  }
  updateAlmacen() {
    this.spinner.show();
    let result = this.global.validateChangeDataForm(this.formEdit);
    if (result.stock_ini) {
      let aux_stock = (result.stock_ini) - (this.itemEdit.stock_ini);
      result.stock_now = this.itemEdit.stock_now + aux_stock;
    }
    if (Object.keys(result).length > 0) {
      this.almacenService.updateAlmacen(result, this.idEditStock).subscribe(
        response => {
          this.displayEdit = false;
          this.spinner.hide();
          this.global.showNotification(response['message'], 'success');
          this.searchAlmacen();
        }, error => {
          this.global.displayError(error);
          this.spinner.hide();
        }
      );
    } else {
      this.displayEdit = false;
      this.spinner.hide();
    }
  }
  
  exportAsXLSX(): void {
    let data_result = this.gridData.map( item => ({
      Codigo: item.code,
      Nombre: item.name,
      Und: item.umed,
      Tipo: item.group,
      Sinicial: item.stock_ini,
      entradas: item.entry,
      salidas: item.output,
      Sactual: item.stock_now,
      'Activo?': item.status
    }));
    this.excelService.exportAsExcelFile(data_result, 'Almacen');
  }

  SumData(data, type) {
    return data.filter(x => x.type === type).reduce((prev, cur) => { return prev + Number(cur.product_qty); }, 0)
  }
}
