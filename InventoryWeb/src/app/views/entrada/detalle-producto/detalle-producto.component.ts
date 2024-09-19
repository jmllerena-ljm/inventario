import { Component, OnInit, Input } from '@angular/core';
import { EntradasService } from '../../../services/entradas.service';
import { GlobalService } from '../../../services/Global';

@Component({
  selector: 'app-detalle-producto',
  templateUrl: './detalle-producto.component.html',
  styleUrls: ['./detalle-producto.component.scss']
})
export class DetalleProductoComponent implements OnInit {
  @Input() product: any = {};
  detalleProducto: any = [];
  identity: any = null;
  constructor(private entradaService: EntradasService, private global: GlobalService,) { }

  ngOnInit() {
    this.identity = this.global.getIdentity();
    if (this.identity === null) {
      this.global.goToLogin();
    } else {
      this.bind();
    }
  }
  bind() {
    this.getDetalle();
  }

  getDetalle() {
    if ( this.product.product_id) {
      this.entradaService.getDetalleProducto(this.product.product_id, '').subscribe(
        response => {
          this.detalleProducto = response['Data'];
        }, error => {
          this.global.displayError(error, false);
        }
      )
    }
  }

  SumData(data, type) {
    return data.filter(x => x.type === type).reduce((prev, cur) => { return prev + Number(cur.product_qty); }, 0)
  }

}
