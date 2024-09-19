import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../services/Global';
import { ToastrService } from 'ngx-toastr';
import { EntSalService } from '../../services/ent-sal.service'
@Component({
  selector: 'app-entrada',
  templateUrl: './entrada.component.html',
  styleUrls: ['./entrada.component.css']
})
export class EntradaComponent implements OnInit {
  identity: any = null;
  gridData: any = [];
  constructor(
    private entradaService: EntSalService,
    private toastr: ToastrService,
    private global: GlobalService) { }

  ngOnInit() {
    this.identity = this.global.getIdentity();
  }

  // BUSQUEDA
  searchEntradas() {
    let pageSize = 25;
    let page = 1;
    let query = {
      number: '',
      name: ''
    };
  }

}
