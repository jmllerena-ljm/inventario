import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { AccessControlModel, AccessControlService } from '../../services/accessControl.service';
import { PurchaseOrderService } from '../../services/purchaseOrder.service';
import { PrintService } from '../../services/print.service';
import { GlobalService } from '../../services/Global';
@Component({
  selector: 'app-pedidos-compra',
  templateUrl: './pedidos-compra.component.html',
  styleUrls: ['./pedidos-compra.component.scss']
})
export class PedidosCompraComponent implements OnInit {
  identity: any = null;
  accessLevel: AccessControlModel = { Id: -1, NivelAcceso: false, Download: false, SuperUser: false };
  gridData: any = [];
  detailData: any = [];
  formSearch: FormGroup;
  formPrint: FormGroup;
  itemEdit: any = null;
  displayDetail: Boolean = false;
  displayPrint: Boolean = false;
  checkGeneral: Boolean = false;
  explandSelectedItems: boolean = false;
  dataCheckSelected: any = [];
  dataPrint: any = [];
  constructor(
    private purchaseOrderService: PurchaseOrderService,
    private accessControl: AccessControlService,
    private printService: PrintService,
    private global: GlobalService,
    private spinner: NgxSpinnerService
  ) {
    this.formSearch = new FormGroup({
      date_ini: new FormControl(''),
      date_fin: new FormControl(''),
      name: new FormControl('')
    });
    this.formPrint = new FormGroup({
      date: new FormControl(''),
      receiver: new FormControl('LA JOYA MINING S.A.C.'),
      starting_point: new FormControl('AV. VARIANTE DE UCHUMAYO KM 1.5 SACHACA - AREQUIPA'),
      arrival_point: new FormControl('SAN JOSE MZ P LOTES 11 Y 12 LA JOYA - AREQUIPA'),
      doc_identify: new FormControl('20539627938'),
      number_invoice: new FormControl(''),
      number_guide: new FormControl('', Validators.required),
      vehicle_mark: new FormControl(''),
      plate_number: new FormControl(''),
      constancy_ins: new FormControl(''),
      license_number: new FormControl(''),
      carrier_name: new FormControl(''),
      carrier_ruc: new FormControl('')
    });
   }

  ngOnInit() {
    this.identity = this.global.getIdentity();
    if (this.identity === null) {
      this.global.goToLogin();
    } else {
      this.accessLevel = this.accessControl.checkAccess(this.identity.strUsuario, 'ACC-015');
      if (this.accessLevel) {
        let date_now = new Date();
        this.formSearch.patchValue({
          date_ini: this.global.getParseDate(new Date(date_now.getFullYear(), date_now.getMonth(), 1)),
          date_fin: this.global.getParseDate(new Date(date_now.getFullYear(), date_now.getMonth()+1, 0))
        });
        this.bind();
      }
    }
  }
  bind() {
    this.searchPedidosCompra();
  }

  // BUSQUEDA
  searchPedidosCompra() {
    this.spinner.show();
    this.purchaseOrderService.searchCompras(this.formSearch.value).subscribe(
      response => {
        this.gridData = response['Data'];
        this.spinner.hide();
      }, error => {
        this.global.displayError(error);
        this.spinner.hide();
      }
    );
  }

  getDetallePedidoCompra(item) {
    this.spinner.show();
    this.displayDetail = true;
    this.detailData = [];
    this.checkGeneral = false;
    this.itemEdit = {
      id: item.id,
      name: item.name,
      date_order: this.global.getParseDate(item.date_order),
      date_approve: this.global.getParseDate(item.date_approve)
    };
    this.purchaseOrderService.searchDetalleCompras(this.itemEdit.id).subscribe(
      response => {
        this.detailData = response['Data'];
        this.spinner.hide();
      }, error => {
        this.global.displayError(error);
        this.spinner.hide();
      }
    );
  }

  changeCheckGeneral() {
    for (let i = 0; i < this.detailData.length; i++) {
      this.detailData[i].check_det  = this.checkGeneral;
      if (this.checkGeneral) {
        let _find = this.dataCheckSelected.find(x => x.id == this.detailData[i].id);
        if(!_find) {
          this.addSelectedItem(this.detailData[i]);
        }
      } else {
        this.deleteSelectedItem(this.detailData[i]);
      }
    }    
  }
  changeCheckItem(item) {
    if (item.check_det) {
      let _find = this.dataCheckSelected.find(x => x.id == item.id);
      if(!_find) {
        this.addSelectedItem(item);
      }
    } else {
      this.deleteSelectedItem(item);
    }
  }
  addSelectedItem(item) {
    let {...new_item} = item;
    new_item.po_name = this.itemEdit.name;
    this.dataCheckSelected.push(new_item);
  }
  deleteSelectedItem(item) {
    this.dataCheckSelected =  this.dataCheckSelected.filter(x => x.id !== item.id);
  }

  // IMPRIMIR GUIA
  handleImprimirGuia() {
    this.formPrint.patchValue({date: this.global.getParseDate(new Date)});
    this.loadDataPrint();

    this.displayPrint = true;
  }
  imprimirGuia() {
    if (this.formPrint.valid) {
      this.printService.printGuide(this.formPrint.value, this.dataPrint);
    }
  }
  loadDataPrint() {
    let dataSelect = this.dataCheckSelected; //this.gridData.filter(x => x.check_seg === true);
    this.dataPrint = [];
    for (let i = 0; i < 29 ; i++) {
      if (dataSelect[i]) {
        let number_po = dataSelect[i].po_name.split('PO');
        const item = {
          description: dataSelect[i].name, //(dataSelect[i].product_code) ? '[' + dataSelect[i].product_code + '] ' + dataSelect[i].product_name : dataSelect[i].product_name,
          unit: 'UN',
          qty: dataSelect[i].product_qty,
          purchase_order: (number_po.length == 2) ? number_po[1] : '',
          number_lic: '',
        };
        this.dataPrint.push(item);
      } else {
        const item = {description: '', unit: '', number_lic: '', purchase_order: ''};
        this.dataPrint.push(item);
      }
    }
  }

}
