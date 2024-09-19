import { Component, OnInit } from '@angular/core';
import { TiposService } from '../../services/tipos.service';
import { GlobalService } from '../../services/Global';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AccessControlModel, AccessControlService } from '../../services/accessControl.service';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.css']
})
export class ConfiguracionComponent implements OnInit {
  identity: any = null;
  accessLevel: AccessControlModel = { Id: -1, NivelAcceso: false, Download: false, SuperUser: false };
  gridData: any = [];
  formSearch: FormGroup;
  displayAdd: Boolean = false;
  displayEdit: Boolean = false;
  formAdd: FormGroup;
  formEdit: FormGroup;
  idEditTipo: string;
  constructor(
    private tipoService: TiposService,
    private accessControl: AccessControlService,
    private global: GlobalService,
    private spinner: NgxSpinnerService
  ) {
    this.formSearch = new FormGroup({
      name: new FormControl('')
    });
    this.formAdd = new FormGroup({
      code: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      text: new FormControl('')
    });
    this.formEdit = new FormGroup({
      code: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      text: new FormControl('')
    });
  }

  ngOnInit() {
    this.identity = this.global.getIdentity();
    if (this.identity === null) {
      this.global.goToLogin();
    } else {
      this.accessLevel = this.accessControl.checkAccess(this.identity.strUsuario, 'ACC-009');
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
  }

  // BUSQUEDA
  searchTipos() {
    this.spinner.show();
    this.tipoService.searchTipos(this.formSearch.value).subscribe(
      response => {
        this.gridData = response['Data'];
        this.spinner.hide();
      }, error => {
        this.global.displayError(error);
        this.spinner.hide();
      }
    );
  }
  handleAdd() {
    this.formAdd.patchValue({
      code: 0,
      name: '',
      text: ''
    });
    this.displayAdd = true;
  }
  saveTipo() {
    this.spinner.show();
    this.tipoService.saveTipo(this.formAdd.value).subscribe(
      response => {
        this.displayAdd = false;
        this.global.showNotification(response['message'], 'success');
        this.spinner.hide();
        this.searchTipos();
      }, error => {
        this.global.displayError(error);
        this.spinner.hide();
      }
    );
  }

  handleEdit(item) {
    this.idEditTipo = item._id;
    this.formEdit.patchValue({
      code: item.code,
      name: item.name,
      text: item.text
    });
    this.displayEdit = true;
  }
  updateTipo() {
    this.spinner.show();
    this.tipoService.updateTipo(this.formEdit.value, this.idEditTipo).subscribe(
      response => {
        this.displayEdit = false;
        this.global.showNotification(response['message'], 'success');
        this.spinner.hide();
        this.searchTipos();
      }, error => {
        this.global.displayError(error);
        this.spinner.hide();
      }
    );
  }
}
