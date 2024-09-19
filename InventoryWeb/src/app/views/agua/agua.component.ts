import { Component, OnInit } from '@angular/core';
import { AguaService } from '../../services/agua.service';
import { ProveedorService } from '../../services/proveedor.service';
import { AccessControlModel, AccessControlService } from '../../services/accessControl.service';
import { GlobalService } from '../../services/Global';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-agua',
  templateUrl: './agua.component.html',
  styleUrls: ['./agua.component.scss']
})
export class AguaComponent implements OnInit {
  identity: any = null;
  accessLevel: AccessControlModel = { Id: -1, NivelAcceso: false, Download: false, SuperUser: false };
  gridData: any = [];
  formSearch: FormGroup;
  formSearchSupp: FormGroup;
  displayAdd: Boolean = false;
  displayEdit: Boolean = false;
  displaySearchSupp: Boolean = false;
  formAdd: FormGroup;
  formEdit: FormGroup;
  idEditAgua: string;
  dataTypes: any = [
    { name: 'AGUA INDUSTRIAL', value: 'AGUA INDUSTRIAL', qty: 0 },
    { name: 'SERVICIO DE AGUA', value: 'SERVICIO DE AGUA', qty: 0 }
  ];
  dataSuppliers: any = [];
  typeSearchSupp: String = '';
  countData = 0;
  pageIndex = 1;
  pageSize = 50;
  totalData: any = []
  constructor(
    private aguaService: AguaService,
    private proveedorService: ProveedorService,
    private accessControl: AccessControlService,
    private global: GlobalService,
    private spinner: NgxSpinnerService
  ) {
    this.formSearch = new FormGroup({
      date_ini: new FormControl(''),
      date_fin: new FormControl(''),
      guide: new FormControl(''),
      type: new FormControl(''),
      supplier: new FormControl('')
    });
    this.formSearchSupp = new FormGroup({
      supp_ruc: new FormControl(''),
      supp_name: new FormControl('')
    })
    this.formAdd = new FormGroup({
      date: new FormControl('', Validators.required),
      guide: new FormControl('', Validators.required),
      qty: new FormControl('', Validators.required),
      supplier_ruc: new FormControl(''),
      supplier_name: new FormControl('', Validators.required),
      type: new FormControl('', Validators.required),
      comment: new FormControl(''),
      user_create: new FormControl('')
    });
    this.formEdit = new FormGroup({
      date: new FormControl('', Validators.required),
      guide: new FormControl('', Validators.required),
      qty: new FormControl('', Validators.required),
      supplier_ruc: new FormControl(''),
      supplier_name: new FormControl('', Validators.required),
      type: new FormControl('', Validators.required),
      comment: new FormControl(''),
      user_update: new FormControl('')
    });
  }

  ngOnInit() {
    this.identity = this.global.getIdentity();
    if (this.identity === null) {
      this.global.goToLogin();
    } else {
      this.accessLevel = this.accessControl.checkAccess(this.identity.strUsuario, 'ACC-006');
      if (this.accessLevel) {
        let fecha_hoy = new Date();
        this.formSearch.patchValue({
          date_ini: this.global.getParseDate(fecha_hoy),
        });
        this.bind();
      }
    }
  }
  bind() {
    if (this.identity.accessLevel === 'read') {
      this.formEdit.disable();
    } else {
      this.formEdit.enable();
    }
    this.searchAgua();
  }

  // BUSQUEDA
  searchAgua() {
    this.spinner.show();
    let date_ini = new Date(this.formSearch.value.date_ini + ' 00:00:00');
    this.formSearch.patchValue({
      date_fin: this.global.getParseDate(date_ini) //(new Date(date_ini.getFullYear(), date_ini.getMonth(), date_ini.getDate() + 1))
    });
    this.aguaService.searchAgua(this.formSearch.value).subscribe(
      response => {
        this.gridData = response['Data'];
        this.calculateTotal(this.gridData);
        this.spinner.hide();
      }, error => {
        this.global.displayError(error);
        this.spinner.hide();
      }
    );
  }
  calculateTotal(data) {
    this.totalData = JSON.parse(JSON.stringify(this.dataTypes));
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      let find = this.totalData.find(x => x.value === item.type);
      find.qty += item.qty;
    }
  }

  searchSuppliers() {
    this.spinner.show();
    this.proveedorService.searchOdooPartners(this.formSearchSupp.value, 1, 15).subscribe(
      response => {
        this.dataSuppliers = response['Data'];
        this.countData = response['Count'];
        this.spinner.hide();
      }, error => {
        this.global.displayError(error);
        this.spinner.hide();
      }
    );
  }


  // CREAR
  handleAdd() {
    this.typeSearchSupp = 'create';
    this.formAdd.patchValue({
      date: this.global.getParseDate(new Date),
      guide: '',
      qty: 0,
      supplier_ruc: '',
      supplier_name: '',
      type: '',
      comment: '',
      user_create: this.identity.strUsuario
    });
    this.displayAdd = true;
  }
  saveAgua() {
    this.spinner.show();
    this.aguaService.saveAgua(this.formAdd.value).subscribe(
      response => {
        this.displayAdd = false;
        this.global.showNotification(response['message'], 'success');
        this.spinner.hide();
        this.searchAgua();
      }, error => {
        this.global.displayError(error);
        this.spinner.hide();
      }
    );
  }

  handleEdit(item) {
    this.idEditAgua = item._id;
    this.typeSearchSupp = 'edit';
    this.formEdit.patchValue({
      date: this.global.getParseDate(item.date),
      guide: item.guide,
      qty: item.qty,
      supplier_ruc: item.supplier_ruc,
      supplier_name: item.supplier_name,
      type: item.type,
      comment: item.comment,
      user_update: this.identity.strUsuario
    });
    this.displayEdit = true;
  }
  updateAgua() {
    this.spinner.show();
    this.aguaService.updateAgua(this.formEdit.value, this.idEditAgua).subscribe(
      response => {
        this.displayEdit = false;
        this.global.showNotification(response['message'], 'success');
        this.spinner.hide();
        this.searchAgua();
      }, error => {
        this.global.displayError(error);
        this.spinner.hide();
      }
    );
  }

  handleSearchSupp() {
    this.displaySearchSupp = true;
    this.searchSuppliers();
  }
  selectItemSupplier(item) {
    if (this.typeSearchSupp === 'create') {
      this.formAdd.patchValue({
        supplier_ruc: item.type_number,
        supplier_name: item.name
      })
    } else {
      this.formEdit.patchValue({
        supplier_ruc: item.type_number,
        supplier_name: item.name
      })
    }
    this.displaySearchSupp = false;
  }
  handlePage(e: any) {
    this.pageIndex = e.pageIndex + 1;
    this.pageSize = e.pageSize;
    this.searchSuppliers();
  }

}
