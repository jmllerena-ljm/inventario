import { Component, OnInit } from '@angular/core';
import { RolService } from '../../../services/rol.service';
import { GlobalService } from '../../../services/Global';
import { ToastrService } from 'ngx-toastr';
import { TreeNode } from 'primeng/api';

import { FormGroup, FormControl, Validators } from '@angular/forms';
@Component({
  selector: 'app-rol',
  templateUrl: './rol.component.html',
  styleUrls: ['./rol.component.css']
})
export class RolComponent implements OnInit {
  identity: any = null;
  gridData: any = [];
  DataAccesos: any = [];
  formAdd: FormGroup;
  formEdit: FormGroup;
  idEditRol: '';
  displayAddRol = false;
  displayEditRol = false;
  rol: Object = {
    strDescripcion: '',
    strUsuarioCrea: ''
  };
  filesTreeAdd: TreeNode[] = [{
    label: 'Accesos',
    collapsedIcon: 'fa fa-folder',
    expandedIcon: 'fa fa-folder-open',
  }];
  selectedAdd: TreeNode[];
  selectedEdit: TreeNode[];
  selectedAccessEdit: string[] = [];
  constructor(
    private rolService: RolService,
    private toastr: ToastrService,
    private global: GlobalService) {
      this.formAdd = new FormGroup({
        strDescripcion: new FormControl('', Validators.required),
        strUsuarioCrea: new FormControl('')
      });
      this.formEdit = new FormGroup({
        strDescripcion: new FormControl('', Validators.required),
        strUsuarioModif: new FormControl('')
      });
    }

  ngOnInit() {
    this.identity = this.global.getIdentity();
    this.searchRol();
    this.filesTreeAdd = [
      {
        label: 'Accesos',
        collapsedIcon: 'fa fa-folder',
        expandedIcon: 'fa fa-folder-open',
        expanded: true,
        children: []
      }];
  }

  searchRol() {
    this.rolService.searchRoles().subscribe(
      response => {
        this.gridData = response['Data'];
      }, error => {
        console.error(error);
      }
    );
  }

  // SEARCH ACCESOS
  searchAccesos() {
    this.rolService.searchAccesos().subscribe(
      response => {
        this.filesTreeAdd[0].children = [];
        this.DataAccesos = response['Data'];
        this.DataAccesos.forEach( element => {
          const item = {
            label: element.strDescripcion,
            data: element._id,
            collapsedIcon: 'fa fa-file-code',
            expandedIcon: 'fa fa-file-code'
          };
          this.filesTreeAdd[0].children.push(item);
        });
      }, error => {
        console.error(error);
      }
    );
  }

  searchAccesosRol(idRol: string) {
    this.rolService.getAccesosRol(idRol).subscribe(
      response => {
        const accesos = response['accesos'];
        accesos.forEach(element => {
          const flag = this.DataAccesos.findIndex(x => x._id === element.acceso);
          this.DataAccesos[flag].status = true;
        });
      }, error => {
        console.error(error);
      }
    )
  }

  // AGREGAR ROL
  handleAdd() {
    this.searchAccesos();
    this.formAdd.setValue(this.rol);
    this.displayAddRol = true;
  }
  addRol() {
    this.formAdd.patchValue({ strUsuarioCrea: this.identity.strUsuario });
    const rolSave = {
      rol: this.formAdd.value,
      accesos: []
    };
    this.selectedAdd.forEach(item => {
      rolSave.accesos.push({_id: item.data, strDescripcion: item.label});
    });

    this.rolService.insertRol(rolSave).subscribe(
      response => {
        this.displayAddRol = false;
        this.toastr.success(response['message'], 'Success'); // Correcto
        this.searchRol();
      }, error => {
        console.error(error);
        this.displayAddRol = false;
        this.toastr.error(error.error.message, 'Error');
      }
    );
  }

  // EDITAR ROL
  handleEdit(item: any) {
    this.selectedEdit = [];
    this.idEditRol = item._id;
    this.searchAccesos();
    this.searchAccesosRol(item._id);
    this.formEdit.patchValue({
      strDescripcion: item.strDescripcion,
      strUsuarioModif: this.identity.strUsuario,
    });
    this.displayEditRol = true;
  }
  editRol() {
    const rolUpdate = {
      rol: this.formEdit.value,
      accesos: []
    };
    this.DataAccesos.forEach(item => {
      if(item.status === true){
        rolUpdate.accesos.push({_id: item._id, strDescripcion: item.strDescripcion});
      }
    });
    
    this.rolService.updateRol(rolUpdate, this.idEditRol).subscribe(
      response => {
        this.displayEditRol = false;
        this.toastr.success(response['message'], 'Success'); // Correcto
        this.searchRol();
      }, error => {
        console.error(error);
        this.displayEditRol = false;
        this.toastr.error(error.error.message, 'Error');
      }
    );
  }
  changeItemAcceso(index) {
    this.DataAccesos[index].status = (this.DataAccesos[index].status) ? false : true;
  }

  // ELIMINAR ROL
  handleDelete(item: any) {
    const FLAG = confirm(`Desea Eliminar el Rol: ${item.strDescripcion} ?`);
    if (FLAG) {
      this.DeleteRol(item._id);
    }
  }
  DeleteRol(idRol: string) {
    this.rolService.deleteRol(idRol).subscribe(
      response => {
        this.toastr.success(response['message'], 'Success'); // Correcto
        this.searchRol();
      }, error => {
        console.error(error);
        this.toastr.error(error.error.message, 'Error');
      }
    );
  }
  redirectEdit(item) {
    alert(item.strDescripcion);
  }

}
