import { Component, OnInit } from '@angular/core';
import { ProveedorService } from '../../services/proveedor.service';
import { GlobalService } from '../../services/Global';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-proveedor',
  templateUrl: './proveedor.component.html',
  styleUrls: ['./proveedor.component.css']
})
export class ProveedorComponent implements OnInit {
  identity: any = null;
  gridData: any = [];
  formAdd: FormGroup;
  formEdit: FormGroup;
  idEditProveedor: '';
  displayAddUser = false;
  displayEditUser = false;
  constructor(
    private productoService: ProveedorService,
    private toastr: ToastrService,
    private global: GlobalService) { }

  ngOnInit() {
    this.identity = this.global.getIdentity();
    this.searchProveedores();
  }

  // BUSQUEDA
  searchProveedores() {
    let pageSize = 25;
    let page = 1;
    let query = {
      number: '',
      name: ''
    };
    this.productoService.getOdooPartners(query, page, pageSize).subscribe(
      response => {
        this.gridData = response['Data'];
      }, error => {
        console.error(error);
      }
    );
  }

}
