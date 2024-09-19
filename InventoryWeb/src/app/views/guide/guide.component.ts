import { Component, OnInit } from '@angular/core';
import { GuideService } from '../../services/guide.service';
import { GlobalService } from '../../services/Global';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AccessControlModel, AccessControlService } from '../../services/accessControl.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-guide',
  templateUrl: './guide.component.html',
  styleUrls: ['./guide.component.scss']
})
export class GuideComponent implements OnInit {
  identity: any = null;
  accessLevel: AccessControlModel = { Id: -1, NivelAcceso: false, Download: false, SuperUser: false };
  gridData: any = [];
  formSearch: FormGroup;
  displayDetail: Boolean = false;
  idEditGuia: string = null;
  constructor(
    private guideService: GuideService,
    private accessControl: AccessControlService,
    private global: GlobalService,
    private spinner: NgxSpinnerService
  ) {
    this.formSearch = new FormGroup({
      number_guide: new FormControl(''),
      date_ini: new FormControl(''),
      date_fin: new FormControl('')
    });
    // this.formEdit = new FormGroup({
    //   number_guide: new FormControl('', Validators.required),
    //   arrival_point: new FormControl(''),
    //   carrier_name: new FormControl(''),
    //   carrier_ruc: new FormControl(''),
    //   constancy_ins: new FormControl(''),
    //   date: new FormControl('', Validators.required),
    //   doc_identify: new FormControl(''),
    //   license_number: new FormControl(''),
    //   number_invoice: new FormControl(''),
    //   plate_number: new FormControl(''),
    //   receiver: new FormControl(''),
    //   starting_point: new FormControl(''),
    //   vehicle_mark: new FormControl(''),
    //   description: new FormControl(''),
    // });
  }

  ngOnInit() {
    this.identity = this.global.getIdentity();
    if (this.identity === null) {
      this.global.goToLogin();
    } else {
      this.accessLevel = this.accessControl.checkAccess(this.identity.strUsuario, 'ACC-016');
      if (this.accessLevel) {
        this.bind();
      }
    }
  }
  bind() {
    // if (this.accessLevel.NivelAcceso === false) {
    //   this.formEdit.disable();
    // } else {
    //   this.formEdit.enable();
    // }
    this.searchGuias();
  }

  // BUSQUEDA
  searchGuias() {
    this.spinner.show();
    this.guideService.searchGuides(this.formSearch.value).subscribe(
      response => {
        this.gridData = response['Data'];
        this.spinner.hide();
      }, error => {
        this.global.displayError(error);
        this.spinner.hide();
      }
    );
  }

  handleDetail(item) {
    this.idEditGuia = null;
    this.idEditGuia = item._id;
    this.displayDetail = true;
  }
  closeDetail() {
    this.displayDetail = false;
    this.idEditGuia = null;
  }
  // updateGuia() {
  //   this.spinner.show();
  //   this.guideService.updateGuide(this.formEdit.value, this.idEditGuia).subscribe(
  //     response => {
  //       this.displayEdit = false;
  //       this.global.showNotification(response['message'], 'success');
  //       this.spinner.hide();
  //       this.searchGuias();
  //     }, error => {
  //       this.global.displayError(error);
  //       this.spinner.hide();
  //     }
  //   );
  // }

}
