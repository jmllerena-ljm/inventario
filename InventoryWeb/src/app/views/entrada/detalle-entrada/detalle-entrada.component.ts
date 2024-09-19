import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EntradasService } from '../../../services/entradas.service';
import { ProveedorService } from '../../../services/proveedor.service';
import { GlobalService } from '../../../services/Global';
import { AccessControlModel, AccessControlService } from '../../../services/accessControl.service';
import { DateLocalePipe } from 'app/pipes/date-locale.pipe';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detalle-entrada',
  templateUrl: './detalle-entrada.component.html',
  styleUrls: ['./detalle-entrada.component.scss']
})
export class DetalleEntradaComponent implements OnInit {
  identity: any = null;
  accessLevel: AccessControlModel = { Id: -1, NivelAcceso: false, Download: false, SuperUser: false };
  DatosEntrada: any = {};
  DatosDetalle: any = [];
  DatosProveedor: any = {};
  dateLocatePipe: DateLocalePipe;
  idEntrada: any = '';
  constructor(
    private activateRoute: ActivatedRoute,
    private entradaService: EntradasService,
    private proveedorService: ProveedorService,
    private accessControl: AccessControlService,
    private global: GlobalService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {
    this.dateLocatePipe = new DateLocalePipe();
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
    this.activateRoute.params.subscribe( params => {
      this.idEntrada = params['id'];
      this.getData(params['id']);
    });
  }

  getData(id: string) {
    this.spinner.show();
    this.entradaService.getDetalle(id).subscribe(
      response => {
        if (response['Entrada'] === null) {
          this.router.navigate ( ['menu', 'movimientos'] );
          this.global.showNotification('No existe el movimiento.', 'danger');
        } else {
          this.DatosEntrada = response['Entrada'];
          this.DatosEntrada['fecha'] = this.dateLocatePipe.transform(this.DatosEntrada.date, 'es-PE');
          this.DatosDetalle = response['Detalle'];
          this.getSupplier(this.DatosEntrada.partner_id);
        }
        this.spinner.hide();
      }, error => {
        this.global.displayError(error);
        this.spinner.hide();
      }
    )
  }
  getSupplier(id) {
    this.proveedorService.getOdoo13Partner(id).subscribe(
      response => {
        if (response['length'] > 0) {
          this.DatosProveedor = response[0];
        }
      }, error => {
        this.global.displayError(error);
      }
    )
  }

  updateEntrada() {
    const FLAG = confirm(`Desea actualizar el movimiento: ${this.DatosEntrada.name} ?`);
    if (FLAG) {
      this.entradaService.updateEntrada({}, this.DatosEntrada._id, this.DatosEntrada.cod).subscribe(
        response => {
          this.global.showNotification(response['message'], 'success');
        }, error => {
          this.global.displayError(error);
        }
      )
    }
  }
  anularEntrada() {
    const FLAG = confirm(`Desea anular el movimiento: ${this.DatosEntrada.name} ?`);
    if (FLAG) {
      this.entradaService.deleteEntrada(this.DatosEntrada._id).subscribe(
        response => {
          this.global.showNotification(response['message'], 'success');
          this.router.navigate ( ['/menu/movimientos'] );
        }, error => {
          this.global.displayError(error);
        }
      )
    }
  }

  handleDeleteItem(item) {
    const FLAG = confirm(`Desea eliminar el Item: ${item.name} ?`);
    if (FLAG) {
      this.entradaService.deleteDetalle(item._id, this.DatosEntrada.company).subscribe(
        response => {
          this.global.showNotification(response['message'], 'success');
          this.getData(this.idEntrada);
        }, error => {
          this.global.displayError(error);
        }
      );
    }
  }

}

