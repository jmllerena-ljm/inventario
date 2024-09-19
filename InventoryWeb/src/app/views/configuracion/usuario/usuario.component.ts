import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../../services/Global';
import { UsuarioService } from '../../../services/usuario.service';
import { AccessControlModel, AccessControlService } from '../../../services/accessControl.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {
  identity: any = null;
  accessLevel: AccessControlModel = { Id: -1, NivelAcceso: false, Download: false, SuperUser: false };
  gridData: any = [];
  DataAccess: any = [];
  formSearch: FormGroup;
  displayAdd: Boolean = false;
  displayEdit: Boolean = false;
  formAdd: FormGroup;
  formEdit: FormGroup;
  idEditUser: string;
  constructor(
    private usuarioService: UsuarioService,
    private accessControl: AccessControlService,
    private global: GlobalService
  ) {
    this.formSearch = new FormGroup({
      name: new FormControl('')
    });
    this.formAdd = new FormGroup({
      strNombre: new FormControl('', Validators.required),
      strApellidos: new FormControl('', Validators.required),
      strEmail: new FormControl('', Validators.required),
      blnSuperAdmin: new FormControl(false),
      strUsuario: new FormControl(''),
      strPassword: new FormControl(''),
      passEmail: new FormControl(''),
      accessLevel: new FormControl('read'),
      rol: new FormControl('', Validators.required),
      access: new FormControl([])
    });
    this.formEdit = new FormGroup({
      strNombre: new FormControl('', Validators.required),
      strApellidos: new FormControl('', Validators.required),
      strEmail: new FormControl('', Validators.required),
      strPassword: new FormControl(''),
      status: new FormControl(false),
      rol: new FormControl('', Validators.required),
    });
  }

  ngOnInit() {
    this.identity = this.global.getIdentity();
    if (this.identity === null) {
      this.global.goToLogin();
    } else {
      this.accessLevel = this.accessControl.checkAccess(this.identity.strUsuario, 'ACC-010');
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
    this.searchUsers();
  }

  // BUSQUEDA
  searchUsers() {
    this.global.showSpinner();
    this.usuarioService.searchUsuarios(this.formSearch.value).subscribe(
      response => {
        this.gridData = response['Data'];
        this.global.showSpinner(false);
      }, error => {
        this.global.displayError(error);
        this.global.showSpinner(false);
      }
    );
  }
  searchAccess(type: string) {
    this.global.showSpinner();
    this.usuarioService.searchAccess().subscribe(
      response => {
        this.DataAccess = response['Data'];
        if (type === 'create') {
          this.DataAccess.forEach(element => {
            element.check = false;
            element.accessLevel = false;
          });
        } else {
          this.getUser(this.idEditUser);
        }
        this.global.showSpinner(false);
      }, error => {
        this.global.displayError(error);
        this.global.showSpinner(false);
      }
    );
  }
  getUser(idUser: string) {
    this.global.showSpinner();
    this.usuarioService.getUsuario(idUser).subscribe(
      response => {
        const access = response['access'];
        access.forEach(item => {
          const flag = this.DataAccess.findIndex(x => x._id === item.acceso);
          this.DataAccess[flag].check = true;
          this.DataAccess[flag].accessLevel = (item.accessLevel);
        });
        this.global.showSpinner(false);
      }, error => {
        this.global.showSpinner(false);
        console.error(error);
      }
    )
  }


  // CREATE
  handleAdd() {
    this.searchAccess('create');
    this.formAdd.patchValue({
      strNombre: '',
      strApellidos: '',
      strEmail: '',
      strPassword: '',
      blnSuperAdmin: false,
      accessLevel: 'read',
      rol: '',
      access: []
    });
    this.displayAdd = true;
  }
  saveUser() {
    this.global.showSpinner();
    let newAccess: any = [];
    this.DataAccess.forEach(item => {
      if (item.check) {
        newAccess.push({ accessLevel: item.accessLevel, acceso: item._id });
      }
    });
    this.formAdd.patchValue({ access: newAccess });
    this.usuarioService.insertUsuario(this.formAdd.value).subscribe(
      response => {
        this.displayAdd = false;
        this.global.showNotification(response['message'], 'success');
        this.global.showSpinner(false);
        this.searchUsers();
      }, error => {
        this.global.displayError(error);
        this.global.showSpinner(false);
      }
    );
  }

  handleEdit(item) {
    this.idEditUser = item._id;
    this.searchAccess('edit');
    this.formEdit.patchValue({
      strNombre: item.strNombre,
      strApellidos: item.strApellidos,
      strEmail: item.strEmail,
      strPassword: item.strPassword,
      status: item.status,
      rol: item.rol
    });
    this.displayEdit = true;
  }
  updateUser() {
    this.global.showSpinner();
    let newAccess: any = [];
    this.DataAccess.forEach(item => {
      if (item.check) {
        newAccess.push({
          accessLevel: (item.accessLevel) ? item.accessLevel : false,
          acceso: item._id
        });
      }
    });
    let data: any = {
      user: this.formEdit.value,
      access: newAccess
    }
    this.usuarioService.updateUsuario(data, this.idEditUser).subscribe(
      response => {
        this.displayEdit = false;
        this.global.showNotification(response['message'], 'success');
        this.global.showSpinner(false);
        this.searchUsers();
      }, error => {
        this.global.displayError(error);
        this.global.showSpinner(false);
      }
    );
  }
}
