import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { ReportesService } from '../../../services/reportes.service';
import { GlobalService } from '../../../services/Global';
import 'apexcharts';

@Component({
  selector: 'app-precio-promedio-producto',
  templateUrl: './precio-promedio-producto.component.html',
  styleUrls: ['./precio-promedio-producto.component.scss']
})
export class PrecioPromedioProductoComponent implements OnInit {
  @Input() year = -1;
  @Input() idProducto = -1;
  @Input() company = '';
  dataPrices: any = null;
  constructor(
    private reportesService: ReportesService,
    private global: GlobalService
  ) { }

  ngOnInit(): void {
    this.getReportePreciosPromedio();
  }

  getReportePreciosPromedio() {
    this.global.showSpinner();
    let query: any = {
      year: this.year,
      productId: this.idProducto,
      company: this.company
    };
    this.reportesService.searchPreciosPromedioProducto(query).subscribe(
      response => {
        const result = response['result'];
        this.dataPrices = (result) ? result : null;
        this.loadGraphPrecioPromedio(this.dataPrices);
        this.global.showSpinner(false);
      }, error => {
        this.global.showSpinner(false);
        this.global.displayError(error);
      }
    );
  }

  loadGraphPrecioPromedio(data) {
    const _title = data.product_name == '' ? 'SIN NOMBRE' : data.product_name;
    const _series = data.months.map(item => item.month_name.substring(0,3).toUpperCase());
    const _data = data.months.map(item => item.average);
    let optionsPP = {
      series: [{
        name: "Total",
        data: _data // [10, 41, 35, 51, 49, 62, 69, 91, 148]
      }],
      chart: {
        height: 270,
        type: 'line',
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false,
        formatter: (val) => {
          return this.global.getNumberFix(val, 2);
        },
      },
      stroke: { curve: 'straight' },
      title: {
        text: _title,
        align: 'left'
      },
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5
        },
      },
      xaxis: {
        categories: _series //['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
      },
      yaxis: {
        labels: { show: true, formatter: (val) => { return this.global.getNumberFix(val, 2); } }
      },
    };
    document.getElementById('product_'+this.idProducto).innerHTML = '';
    let chartPP = new ApexCharts(document.querySelector('#product_'+this.idProducto), optionsPP);
    chartPP.render();
  }

}
