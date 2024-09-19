import { Component, OnInit } from '@angular/core';
import { EntradasService } from '../../../services/entradas.service';
import { ProveedorService } from '../../../services/proveedor.service';
import { DateLocalePipe } from 'app/pipes/date-locale.pipe';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AccessControlModel, AccessControlService } from '../../../services/accessControl.service';
import { GlobalService } from '../../../services/Global';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-crear-entrada',
  templateUrl: './crear-entrada.component.html',
  styleUrls: ['./crear-entrada.component.scss']
})
export class CrearEntradaComponent implements OnInit {
  identity: any = null;
  accessLevel: AccessControlModel = { Id: -1, NivelAcceso: false, Download: false, SuperUser: false };
  DatosEntrada: any = {
    id: -1,
    name: '',
    type: '',
    origin: '',
    date: '',
    picking_type_id: -1,
    partner_id: -1,
    po_id: -1,
    status: true,
    create_user: ''
  };
  ListaEntradas: any = [];

  DatosDetalle: any = [];
  DatosProveedor: any = { name: '', type_number: '' };
  SuministrosOdoo: any = [];
  dateLocatePipe: DateLocalePipe;
  displaySearchOdoo: Boolean = false;
  displayMessageSave: Boolean = false;
  messageSave = { title: '', message: ''};
  formSearchOdoo: FormGroup;
  checkGeneral: Boolean = false;
  constructor(
    private entradaService: EntradasService,
    private proveedorService: ProveedorService,
    private accessControl: AccessControlService,
    private router: Router,
    private global: GlobalService,
    private spinner: NgxSpinnerService
  ) {
    this.dateLocatePipe = new DateLocalePipe();
    this.formSearchOdoo = new FormGroup({
      name: new FormControl(''),
      date_ini: new FormControl(global.getParseDate(new Date())),
      date_fin: new FormControl(global.getParseDate(new Date())),
    });
  }

  ngOnInit() {
    this.identity = this.global.getIdentity();
    if (this.identity === null) {
      this.global.goToLogin();
    } else {
      this.accessLevel = this.accessControl.checkAccess(this.identity.strUsuario, 'ACC-003');
      if (this.accessLevel.NivelAcceso === false) {
        this.global.showNotification('No tiene permisos para acceder a esta pagina', 'warning');
        this.router.navigate(['/menu/dashboard']);
      }
    }
  }
  handleSearch() {
    // this.searchStockPicking();
    this.displaySearchOdoo = true;
  }

  // Search Odoo - Stock Picking
  searchStockPicking() {
    this.spinner.show();
    const pageSize = 100;
    const page = 1;
    this.entradaService.getOdooStockPicking(this.formSearchOdoo.value, page, pageSize).subscribe(
      response => {
        this.SuministrosOdoo = response['Data'];
        this.spinner.hide();
      }, error => {
        this.global.displayError(error);
        this.spinner.hide();
      }
    )
  }

  // SAVE
  handleSave() {
    let _data = this.ListaEntradas;
    this.saveEntrada(_data);
    // data.forEach(elementI => {
    //   this.saveEntrada(elementI);
    // });
  }
  saveEntrada(data) {
    this.spinner.show();
    // const entradaSaved = {
    //   entrada : register,
    //   detalle : register.detalle
    // }
    this.entradaService.saveEntrada(data).subscribe(
      response => {
        this.spinner.hide();
        this.global.showNotification(response['message']);
      }, error => {
        this.global.displayError(error);
        this.spinner.hide();
      }
    )
  }

  changeCheckGeneral() {
    for (let i = 0; i < this.SuministrosOdoo.length; i++) {
      this.SuministrosOdoo[i].reception_to_invoice  = this.checkGeneral;
    }
  }

  SelectItem(itemEnt) {
    this.entradaService.getOdooDetalleStockPicking(itemEnt.id, itemEnt.type).subscribe(
      response => {
        this.DatosDetalle = [];
        let _detalle: any = [];
        const DATA = response['Data'];
        for (let i = 0; i < DATA.length; i++) {
          const item = {
            id: DATA[i].id,
            ent_id: (itemEnt.type === 'IN') ? DATA[i].order_id : DATA[i].picking_id,
            code: DATA[i].code,
            name: DATA[i].name,
            product_id: DATA[i].product_id,
            product_qty: DATA[i].product_qty,
            price_unit: DATA[i].price_unit,
            create_user: this.identity.strUsuario,
            status: true,
          }
          _detalle.push(item);
        }
        itemEnt.detalle = _detalle;
        this.proveedorService.getOdooPartner(itemEnt.partner_id).subscribe(
          success => {
            if (success['Count'] > 0) {
              itemEnt.supplier = { name : success['Data'][0].name, type_number : success['Data'][0].type_number };
            } else {
              itemEnt.supplier = {name : '', type_number : ''};
            }
            this.ListaEntradas.push(itemEnt);
          }, err => {
            console.error(err);
            this.global.showNotification(err.error.message, 'danger');
          }
        )
      }, error => {
        this.global.displayError(error);
      }
    )
  }

  CargarEntradasSelected() {
    let dataSelect = this.SuministrosOdoo.filter(x => x.reception_to_invoice === true);
    this.ListaEntradas = [];
    for (let i = 0; i < dataSelect.length; i++) {
      let item = dataSelect[i];
      const pattern = /\\/;
      const _split = item.name.split( pattern );
      let _item = {
        id: item.id,
        name: item.name,
        type: _split[1],
        origin: item.origin,
        date: item.date,
        picking_type_id: item.picking_type_id,
        partner_id: item.partner_id,
        po_id: item.po_id,
        status: true,
        create_user: this.identity.strUsuario,
        supplier: {},
        detalle: []
      };
      this.SelectItem(_item);
    }
    this.displaySearchOdoo = false;
  }
}
