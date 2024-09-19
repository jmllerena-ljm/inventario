import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../../services/usuario.service';
import { RolService } from '../../../services/rol.service';
import { GlobalService } from '../../../services/Global';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormControl, Validators } from '@angular/forms';
@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {
  identity: any = null;
  gridData: any = [];
  dataRoles: any = [];
  formAdd: FormGroup;
  formEdit: FormGroup;
  idEditUsuario: '';
  displayAddUser = false;
  displayEditUser = false;
  usuario: Object = {
    strNombre: '',
    strApellidos: '',
    strUsuario: '',
    strPassword: '',
    strEmail: '',
    blnSuperAdmin: false,
    rol: '',
    strUsuarioCrea: ''
  };
  constructor(
    private usuarioService: UsuarioService,
    private rolService: RolService,
    private toastr: ToastrService,
    private global: GlobalService) {
    this.formAdd = new FormGroup({
      strNombre: new FormControl('', Validators.required),
      strApellidos: new FormControl('', Validators.required),
      strUsuario: new FormControl('', Validators.required),
      strPassword: new FormControl('', Validators.required),
      strEmail: new FormControl(''),
      blnSuperAdmin: new FormControl(false, Validators.required),
      rol: new FormControl('', Validators.required),
      strUsuarioCrea: new FormControl('')
    });
    this.formEdit = new FormGroup({
      strNombre: new FormControl('', Validators.required),
      strApellidos: new FormControl('', Validators.required),
      strUsuario: new FormControl('', Validators.required),
      strPassword: new FormControl('', Validators.required),
      strEmail: new FormControl(''),
      blnSuperAdmin: new FormControl(false, Validators.required),
      rol: new FormControl('', Validators.required),
      strUsuarioModif: new FormControl('')
    });
  }

  ngOnInit() {
    this.identity = this.global.getIdentity();
    this.searchUsuarios();
  }
  // BUSQUEDA
  searchUsuarios() {
    this.usuarioService.searchUsuarios().subscribe(
      response => {
        this.gridData = response['Data'];
      }, error => {
        console.error(error);
      }
    );
  }
  searchRoles() {
    this.rolService.searchRoles().subscribe(
      response => {
        this.dataRoles = response['Data'];
      }, error => {
        console.error(error);
        this.toastr.error(error.error.message, 'Error');
      }
    );
  }

  // AGREGAR USUARIO
  handleAdd() {
    this.formAdd.setValue(this.usuario);
    this.searchRoles();
    this.displayAddUser = true;
  }
  addUsuario() {
    this.formAdd.patchValue({ strUsuarioCrea: this.identity.strUsuario });
    this.usuarioService.insertUsuario(this.formAdd.value).subscribe(
      response => {
        this.displayAddUser = false;
        this.toastr.success(response['message'], 'Success'); // Correcto
        this.searchUsuarios();
      }, error => {
        console.error(error);
        this.displayAddUser = false;
        this.toastr.error(error.error.message, 'Error');
      }
    );
  }

  // EDITAR USUARIO
  handleEdit(item: any) {
    this.idEditUsuario = item._id;
    this.searchRoles();
    this.formEdit.patchValue({
      strNombre: item.strNombre,
      strApellidos: item.strApellidos,
      strUsuario: item.strUsuario,
      strPassword: item.strPassword,
      strEmail: item.strEmail,
      blnSuperAdmin: item.blnSuperAdmin,
      rol: item.rol._id,
      strUsuarioModif: this.identity.strUsuario,
    });
    this.displayEditUser = true;
  }
  editUsuario() {
    this.usuarioService.updateUsuario(this.formEdit.value, this.idEditUsuario).subscribe(
      response => {
        this.displayEditUser = false;
        this.toastr.success(response['message'], 'Success'); // Correcto
        this.searchUsuarios();
      }, error => {
        console.error(error);
        this.displayEditUser = false;
        this.toastr.error(error.error.message, 'Error');
      }
    );
  }

  // ELIMINAR USUARIO
  handleDelete(item: any) {
    const FLAG = confirm(`Desea Eliminar el Usuario: ${item.strUsuario} ?`);
    if (FLAG) {
      this.DeleteUsuario(item._id);
    }
  }
  DeleteUsuario(idUser: string) {
    this.usuarioService.deleteUsuario(idUser).subscribe(
      response => {
        this.toastr.success(response['message'], 'Success'); // Correcto
        this.searchUsuarios();
      }, error => {
        console.error(error);
        this.toastr.error(error.error.message, 'Error');
      }
    );
  }

}
