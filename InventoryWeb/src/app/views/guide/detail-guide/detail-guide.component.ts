import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GuideService } from '../../../services/guide.service';
import { PrintService } from '../../../services/print.service';
import { GlobalService } from '../../../services/Global';

@Component({
  selector: 'app-detail-guide',
  templateUrl: './detail-guide.component.html',
  styleUrls: ['./detail-guide.component.scss']
})
export class DetailGuideComponent implements OnInit {
  @Input() id_guide = null;
  formGuide: any = {};
  detailGuide: any = [];
  constructor(
    private guideService: GuideService,
    private printService: PrintService,
    private global: GlobalService
  ) { }

  ngOnInit(): void {
    this.getGuia();
  }

  getGuia() {
    if(this.id_guide) {
      this.global.showSpinner();
      this.guideService.getGuide(this.id_guide).subscribe(
        response => {
          this.formGuide = response['Data'];
          this.detailGuide = response['Detail'];
          this.global.showSpinner(false);
        }, error => {
          this.global.showSpinner(false);
          this.global.displayError(error);
        }
      );
    }
  }

  imprimirGuia() {
    this.printService.printGuide(this.formGuide, this.detailGuide);
  }

}
