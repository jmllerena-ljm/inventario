import { Component, OnInit } from '@angular/core';
import { EntradasService } from '../../../services/entradas.service';
import { CompanyService } from '../../../services/company.service';
import { GlobalService } from '../../../services/Global';
import { AccessControlModel, AccessControlService } from '../../../services/accessControl.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, NavigationExtras } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-datos-entrada',
  templateUrl: './datos-entrada.component.html',
  styleUrls: ['./datos-entrada.component.scss']
})
export class DatosEntradaComponent implements OnInit {
  identity: any = null;
  accessLevel: AccessControlModel = { Id: -1, NivelAcceso: false, Download: false, SuperUser: false };
  gridData: any = [];
  formSearch: FormGroup;
  countData = 0;
  pageIndex = 1;
  pageSize = 50;
  dataCompany: any = [];
  constructor(
    private entradaService: EntradasService,
    private companyService: CompanyService,
    private accessControl: AccessControlService,
    private global: GlobalService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {
    this.formSearch = new FormGroup({
      name: new FormControl(''),
      date_ini: new FormControl(global.getParseDate(new Date(new Date().getFullYear(), new Date().getMonth(), 1))),
      date_fin: new FormControl(global.getParseDate(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0))),
      company: new FormControl('')
    });
  }

  ngOnInit() {
    this.identity = this.global.getIdentity();
    if (this.identity === null) {
      this.global.goToLogin();
    } else {
      this.accessLevel = this.accessControl.checkAccess(this.identity.strUsuario, 'ACC-003');
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
          this.searchEntradas();
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

  // BUSQUEDA
  searchEntradas() {
    this.spinner.show();
    this.entradaService.getEntradas(this.formSearch.value, this.pageIndex, this.pageSize).subscribe(
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

  onSelected(item) {
    // const navigationExtras: NavigationExtras = {
    //   queryParams: { 'id': item._id}
    // };
    // this.router.navigate(['/menu/entrada/detalle'], navigationExtras);
    this.router.navigate ( ['/menu/movimientos/detalle', item._id] );
  }

  handlePage(e: any) {
    this.pageIndex = e.pageIndex + 1;
    this.pageSize = e.pageSize;
    this.searchEntradas();
  }


}
