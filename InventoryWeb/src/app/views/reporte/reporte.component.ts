import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AccessControlModel, AccessControlService } from '../../services/accessControl.service';
import { EntradasService } from '../../services/entradas.service';
import { Seguimiento13Service } from '../../services/seguimiento13.service';
import { CompanyService } from '../../services/company.service';
import { AlmacenService } from '../../services/almacen.service';

import { GlobalService } from '../../services/Global';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import 'apexcharts';

@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.scss']
})
export class ReporteComponent implements OnInit {
  identity: any = null;
  accessLevel: AccessControlModel = { Id: -1, NivelAcceso: false, Download: false, SuperUser: false };
  gridData: any = [];
  formSearchMoves: FormGroup;
  // paginator
  countData = 0;
  pageIndex = 1;
  pageSize = 50;
  monthNames: any = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  gridTopCompras: any;
  gridComprasArea: any;
  dataBaseFilter: String = '';
  companyFilter: String = '';

  //
  selectedYear: number;
  listMonths: any = [
    { id: 0, name: 'Enero' },
    { id: 1, name: 'Febrero' },
    { id: 2, name: 'Marzo' },
    { id: 3, name: 'Abril' },
    { id: 4, name: 'Mayo' },
    { id: 5, name: 'Junio' },
    { id: 6, name: 'Julio' },
    { id: 7, name: 'Agosto' },
    { id: 8, name: 'Septiembre' },
    { id: 9, name: 'Octubre' },
    { id: 10, name: 'Noviembre' },
    { id: 11, name: 'Diciembre' },
  ];
  selectedMonthsKpis = [];
  selectedMonthsTop = [];
  dataYears: any = [];
  dataKpis: any = [];
  totals_kpis: any = {};
  dataCompany: any = [];

  // Precios Promedio
  products: Observable<any[]>;
  selectedProductIds = '';
  timeoutId: any = '';
  constructor(
    private accessControl: AccessControlService,
    private entradaService: EntradasService,
    private seguimiento13Service: Seguimiento13Service,
    private companyService: CompanyService,
    private almacenService: AlmacenService,
    private global: GlobalService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {
    this.formSearchMoves = new FormGroup({
      code: new FormControl(''),
      name: new FormControl('')
    });
  }

  ngOnInit() {
    this.identity = this.global.getIdentity();
    if (this.identity === null) {
      this.global.goToLogin();
    } else {
      this.accessLevel = this.accessControl.checkAccess(this.identity.strUsuario, 'ACC-008');
      if (this.accessLevel) {
        this.getYears();
        this.searchCompanies();
      }
    }
  }
  bind(name?) {
    if ( name === 'licitations' ) {
      this.graphSeguimiento();
    } else if (name === 'top') {
      this.topCompras();
    } else if (name === 'prices') {
      this.searchProductos('');
    } else {
      this.searchReporte();
    }
  }
  getYears() {
    let year_now = (new Date()).getFullYear();
    this.selectedYear = year_now;
    this.selectedMonthsKpis = [];
    this.selectedMonthsTop = [];
    this.selectedMonthsKpis.push(this.listMonths[(new Date()).getMonth()].id);
    this.selectedMonthsTop.push(this.listMonths[(new Date()).getMonth()].id);
    for (let i = 0; i < 15; i++) {
      this.dataYears.push((year_now - i).toString());
    }
  }

  // SEARCH COMPANIES
  searchCompanies() {
    this.spinner.show();
    let data: any = { name: '' };
    this.companyService.searchCompanies(data).subscribe(
      response => {
        this.dataCompany = response;
        if (this.dataCompany.length > 0) {
          this.dataBaseFilter = this.dataCompany[0].code_odoo;
          this.companyFilter = this.dataCompany[0]._id;
          this.spinner.hide();
          this.bind();
        } else {
          this.spinner.hide();
          this.global.showNotification('No se encontraron datos de Campañas', 'danger')
        }
      }, error => {
        this.global.displayError(error);
        this.spinner.hide();
      }
    );
  }

  graphSeguimiento() {
    if (this.selectedMonthsKpis.length > 0) {
      let _months = [];
      this.spinner.show();
      for (let i = 0; i < this.selectedMonthsKpis.length; i++) {
        const item = this.selectedMonthsKpis[i];
        let _mes = this.listMonths[item];
        let _mth = {
          id: _mes.id,
          name: _mes.name,
          date_ini: this.global.getParseDate(new Date(this.selectedYear, _mes.id, 1)),
          date_fin: this.global.getParseDate(new Date(this.selectedYear, _mes.id + 1, 0)),
        }
        _months.push(_mth);
      }
      _months.sort((a, b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0));
      let data = {
        months: _months,
        database: this.dataBaseFilter
      }
      this.seguimiento13Service.reporteSeguimientoOdoo13(data).subscribe(
        response => {
          this.dataKpis = response['Datos'];
          let counts_data: any = [];
          let counts_items: any = [];
          let counts_quoted: any = [];
          let counts_purchase: any = [];
          let counts_send: any = [];
          let labes_data: any = [];
          let totals = { count_bidding: 0, quoted_total: 0, purchase_total: 0, send_total: 0, porc_quoted: 0, porc_send: 0, porc_effic: 0 };
          let _promCot = 0, _promSend = 0;
          for (let i = 0; i < this.dataKpis.length; i++) {
            this.dataKpis[i].porc_quoted = (this.dataKpis[i].count_bidding === '0') ? 0 : this.dataKpis[i].quoted_total / Number(this.dataKpis[i].count_bidding);
            this.dataKpis[i].porc_send = (this.dataKpis[i].count_bidding === '0') ? 0 : this.dataKpis[i].send_total / Number(this.dataKpis[i].count_bidding);
            labes_data.push(this.dataKpis[i].name);
            counts_data.push(this.dataKpis[i].porc_send * 100);

            totals.count_bidding += Number(this.dataKpis[i].count_bidding);
            totals.quoted_total += this.dataKpis[i].quoted_total;
            totals.purchase_total += this.dataKpis[i].purchase_total;
            totals.send_total += this.dataKpis[i].send_total;

            counts_items.push(Number(this.dataKpis[i].count_bidding));
            counts_quoted.push(this.dataKpis[i].quoted_total);
            counts_purchase.push(this.dataKpis[i].purchase_total);
            counts_send.push(this.dataKpis[i].send_total);

            _promCot += this.dataKpis[i].porc_quoted;
            _promSend += this.dataKpis[i].porc_send;
          }
          totals.porc_quoted = _promCot / this.dataKpis.length;
          totals.porc_send = _promSend / this.dataKpis.length;
          totals.porc_effic = (totals.porc_quoted + totals.porc_send) / 2;
          this.totals_kpis = totals;
          this.loadGraphItems(labes_data, counts_data);
          this.loadEfficiency( this.global.getNumberFormatFix(totals.porc_effic * 100, 1));

          this.loadGraphBidding(labes_data, counts_items, counts_quoted, counts_purchase, counts_send);
          this.spinner.hide();
        }, error => {
          this.spinner.hide();
          this.global.displayError(error);
        }
      );
    } else {
      this.global.showNotification('Seleccione al menos un mes', 'warning');
    }
  }

  loadGraphItems(labels, counts) {
    let options = {
      title: { text: '% ATENDIDO', align: 'center' },
      series: [
        { name: 'Total', data: counts },
      ],
      chart: { type: 'bar', height: 350 },
      xaxis: { categories: labels },
      yaxis: {
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: { show: false, formatter: (val) => { return val + '%'; } }
      },
      plotOptions: {
        bar: { dataLabels: { position: 'top' } }
      },
      dataLabels: {
        enabled: true,
        formatter: (val) => {
          return this.global.getNumberFormatFix(val, 1) + '%';
        },
        offsetY: -20,
        style: {
          fontSize: '11px',
          colors: ['#304758']
        }
      },
    };
    document.getElementById('chartRepLicitacion').innerHTML = '';
    let chartItems = new ApexCharts(document.querySelector('#chartRepLicitacion'), options);
    chartItems.render();
  }
  loadEfficiency(value) {
    let value_efic = (value > 100) ? 100 : value;
    let options = {
      series: [value_efic],
      chart: { height: 150, type: 'radialBar' },
      plotOptions: {
        radialBar: { hollow: { size: '65%' } },
      },
      labels: ['Eficiencia'],
    };
    document.getElementById('chartEfficiency').innerHTML = '';
    let chartEffic = new ApexCharts(document.querySelector('#chartEfficiency'), options);
    chartEffic.render();
  }
  loadGraphBidding(labels, counts, count_quoted, count_purchase, count_send) {
    let optionsBidding = {
      title: { text: 'Cantidad Items', align: 'center' },
      series: [
        { name: 'Total Items', data: counts },
        { name: 'Cotizado', data: count_quoted },
        { name: 'Comprado', data: count_purchase },
        { name: 'Atendido', data: count_send },
      ],
      chart: { type: 'bar', height: 350 },
      plotOptions: {
        bar: { horizontal: false, dataLabels: { position: 'top' }, columnWidth: '55%', endingShape: 'rounded' }
      },
      // dataLabels: { enabled: false },
      dataLabels: {
        enabled: true,
        formatter: (val) => {
          return val;
        },
        offsetY: -20,
        style: {
          fontSize: '10px',
          colors: ['#304758']
        }
      },
      stroke: { show: true, width: 2, colors: ['transparent'] },
      xaxis: { categories: labels },
      fill: { opacity: 1 },
    };
    document.getElementById('chartRepBidding').innerHTML = '';
    let chartBidding = new ApexCharts(document.querySelector('#chartRepBidding'), optionsBidding);
    chartBidding.render();
  }

  topCompras() {
    if (this.selectedMonthsTop.length > 0) {
      this.global.showSpinner();
      let _months = this.selectedMonthsTop;
      _months.sort((a, b) => (a > b) ? 1 : ((b > a) ? -1 : 0));
      let data = {
        date_ini: this.global.getParseDate(new Date(this.selectedYear, _months[0], 1)),
        date_fin: this.global.getParseDate(new Date(this.selectedYear, _months[_months.length-1] + 1, 1)),
        database: this.dataBaseFilter,
        limit: 30
      };
      this.seguimiento13Service.reporteTopComprasOdoo13(data).subscribe(
        response => {
          this.gridTopCompras = response['Data'];
          this.gridComprasArea = response['DataArea'];
          this.loadChartComprasArea(this.gridComprasArea);
          this.global.showSpinner(false);
        }, error => {
          this.global.displayError(error);
          this.global.showSpinner(false);
        }
      );
    } else {
      this.global.showNotification('Seleccione al menos un mes', 'warning');
    }
  }

  loadChartComprasArea(data) {
    let _categ = (data.map(t => t.area_name));
    let _series = (data.map(t => Number(t.count_area)));

    let options = {
      chart: {
        type: 'pie',
        toolbar: { show: false }
      },
      series: _series,
      labels: _categ,
      dataLabels: {
        enabled: true,
        style: { colors: ['#444546'], fontSize: '14px' },
        dropShadow: { enabled: false }
      },
      legend: { show: true, position: 'bottom', },
    }

    document.getElementById('chartComprasArea').innerHTML = '';
    let chart = new ApexCharts(document.querySelector('#chartComprasArea'), options);
    chart.render();
  }

  searchReporte() {
    this.spinner.show();
    this.entradaService.getReporte(this.formSearchMoves.value, this.pageIndex, this.pageSize).subscribe(
      response => {
        this.gridData = response['Data'];
        this.countData = response['Count'];
        this.spinner.hide();
      }, error => {
        this.global.displayError(error);
        this.spinner.hide();
      }
    );
  }

  // buscar Productos
  searchProductos(inputSearch) {
    clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => {
      let _inputS = inputSearch.trim();
      this.spinner.show();
      let query: any = {
        input: _inputS
      }
      this.almacenService.searchProducts(query, 1, 10).subscribe(
        response => {
          this.products = response['Data'];
          this.spinner.hide();
        }, error => {
          this.global.displayError(error);
          this.spinner.hide();
        }
      );
    }, 600);
  }

  handleChangeTab(name) {
    this.bind(name);
  }

  handleClick(item) {
    this.router.navigate ( ['/menu/movimientos/detalle', item._id] );
  }

  handlePage(e: any) {
    this.pageIndex = e.pageIndex + 1;
    this.pageSize = e.pageSize;
    this.searchReporte();
  }

}
