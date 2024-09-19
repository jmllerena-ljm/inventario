import { Component, OnInit } from '@angular/core';
import { ProveedorService } from '../../services/proveedor.service';
import { GlobalService } from '../../services/Global';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AccessControlModel, AccessControlService } from '../../services/accessControl.service';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-proveedor',
  templateUrl: './proveedor.component.html',
  styleUrls: ['./proveedor.component.css']
})
export class ProveedorComponent implements OnInit {
  identity: any = null;
  accessLevel: AccessControlModel = { Id: -1, NivelAcceso: false, Download: false, SuperUser: false };
  gridData: any = [];
  formSearch: FormGroup;
  formAdd: FormGroup;
  formEdit: FormGroup;
  displayAdd: Boolean = false;
  displayEdit: Boolean = false;
  idEditProveedor: string;
  constructor(
    private proveedorService: ProveedorService,
    private global: GlobalService,
    private spinner: NgxSpinnerService,
    private accessControl: AccessControlService
  ) {
    this.formSearch = new FormGroup({
      number: new FormControl(''),
      name: new FormControl(''),
    });

    this.formAdd = new FormGroup({
      typeDoc: new FormControl(''),
      docNumber: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(11)]),
      name: new FormControl('', Validators.required),
      email: new FormControl(''),
      phone: new FormControl(''),
      address: new FormControl(''),
      type: new FormControl('')
    });
    this.formEdit = new FormGroup({
      docNumber: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(11)]),
      name: new FormControl('', Validators.required),
      email: new FormControl(''),
      phone: new FormControl(''),
      address: new FormControl(''),
      type: new FormControl(''),
    });
  }

  ngOnInit() {
    this.identity = this.global.getIdentity();
    if (this.identity === null) {
      this.global.goToLogin();
    } else {
      this.accessLevel = this.accessControl.checkAccess(this.identity.strUsuario, 'ACC-014');
      if (this.accessLevel) {
        this.bind();
      }
    }
  }
  bind() {
    this.searchProveedores();
  }

  // BUSQUEDA
  searchProveedores() {
    this.spinner.show();
    const pageSize = 25;
    const page = 1;
    this.proveedorService.searchProveedores(this.formSearch.value).subscribe(
      response => {
        this.gridData = response['Data'];
        this.spinner.hide();
      }, error => {
        this.global.displayError(error);
        this.spinner.hide();
      }
    );
  }
  
  // Añadir
  handleAdd() {
    this.formAdd.patchValue({
      typeDoc: 'RUC',
      docNumber: '',
      name: '',
      email: '',
      phone: '',
      address: '',
      type: '',
    });
    this.displayAdd = true;
  }
  saveProveedor() {
    this.spinner.show();
    this.proveedorService.saveProveedor(this.formAdd.value).subscribe(
      response => {
        this.displayAdd = false;
        this.global.showNotification(response['message'], 'success');
        this.spinner.hide();
        this.searchProveedores();
      }, error => {
        this.global.displayError(error);
        this.spinner.hide();
      }
    );
  }

  // Editar
  handleEdit(item) {
    this.idEditProveedor = item._id;
    this.formEdit.patchValue({
      docNumber: item.docNumber,
      name: item.name,
      email: item.email,
      phone: item.phone,
      address: item.address,
      type: item.type,
    });
    this.displayEdit = true;
  }
  updateProveedor() {
    this.spinner.show();
    this.proveedorService.updateProveedor(this.formEdit.value, this.idEditProveedor).subscribe(
      response => {
        this.displayEdit = false;
        this.global.showNotification(response['message'], 'success');
        this.spinner.hide();
        this.searchProveedores();
      }, error => {
        this.global.displayError(error);
        this.spinner.hide();
      }
    );
  }

}
