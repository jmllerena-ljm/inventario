import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../services/producto.service';
import { GlobalService } from '../../services/Global';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormControl, Validators } from '@angular/forms';
@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit {
  identity: any = null;
  gridData: any = [];
  formSearch: FormGroup;
  constructor(
    private productoService: ProductoService,
    private toastr: ToastrService,
    private global: GlobalService) {
      this.formSearch = new FormGroup({
        name: new FormControl(''),
        code: new FormControl(''),
      });
    }

  ngOnInit() {
    this.identity = this.global.getIdentity();
    this.searchProductos();
  }

  // BUSQUEDA
  searchProductos() {
    let pageSize = 25;
    let page = 1;
    this.productoService.getOdooProducts(this.formSearch.value, page, pageSize).subscribe(
      response => {
        this.gridData = response['Data'];
      }, error => {
        console.error(error);
        this.toastr.error(error.error.message, 'Error');
      }
    );
  }

}
