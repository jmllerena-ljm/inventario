import { Component, OnInit } from '@angular/core';
import { AlmacenService } from '../services/almacen.service';
import { GlobalService } from '../services/Global';
import * as Chartist from 'chartist';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  identity: any = null;
  dataReport: any = {};
  constructor(
    private almacenService: AlmacenService,
    private global: GlobalService
  ) { }

  ngOnInit() {
    this.identity = this.global.getIdentity();
    if (this.identity === null) {
      this.global.goToLogin();
    } else {
      this.getReporteCount();
    }
  }

  getReporteCount() {
    this.almacenService.getReporteCount().subscribe(
      response => {
        this.dataReport = response['Data'];
      }, error => {
        this.global.displayError(error);
      }
    )
  }

}
