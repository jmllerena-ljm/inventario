import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FirmaService } from '../../../services/firma.service';
import { GlobalService } from '../../../services/Global';
import { AccessControlModel, AccessControlService } from '../../../services/accessControl.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-firma',
  templateUrl: './firma.component.html',
  styleUrls: ['./firma.component.scss']
})
export class FirmaComponent implements OnInit {
  identity: any = null;
  accessLevel: AccessControlModel = { Id: -1, NivelAcceso: false, Download: false, SuperUser: false };
  gridData: any = [];
  formSearch: FormGroup;
  displayAdd: Boolean = false;
  displayEdit: Boolean = false;
  formAdd: FormGroup;
  formEdit: FormGroup;
  itemEdit: any = {};
  idEditFirma: string;
  dataTipos: any = [
    { value: 'Solicita', name: 'Solicita' },
    { value: 'Autoriza', name: 'Autoriza' },
  ];
  // Upload
  url: String = '';
  filesToUpload: Array<File>;
  @ViewChild('fileInputAdd', {static: false}) myFileInputAdd: ElementRef;
  @ViewChild('fileInputEdit', {static: false}) myFileInputEdit: ElementRef;
  constructor(
    private firmaService: FirmaService,
    private global: GlobalService,
    private accessControl: AccessControlService,
    private spinner: NgxSpinnerService
  ) {
    this.formSearch = new FormGroup({
      name: new FormControl('')
    });
    this.formAdd = new FormGroup({
      code: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      type: new FormControl('', Validators.required),
      create_user: new FormControl('')
    });
    this.formEdit = new FormGroup({
      code: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      type: new FormControl('', Validators.required),
      status: new FormControl(false, Validators.required)
    });

    this.url = global.getUrl();
  }

  ngOnInit() {
    this.identity = this.global.getIdentity();
    if (this.identity === null) {
      this.global.goToLogin();
    } else {
      this.accessLevel = this.accessControl.checkAccess(this.identity.strUsuario, 'ACC-012');
      if (this.accessLevel) {
        this.bind();
      }
    }
  }
  bind() {
    if (this.accessLevel.NivelAcceso === false) {
      this.formEdit.disable();
    } else {
      this.formEdit.enable();
    }
    this.searchFirmas();
  }

  // BUSQUEDA
  searchFirmas() {
    this.spinner.show();
    this.firmaService.searchFirmas(this.formSearch.value).subscribe(
      response => {
        this.gridData = response['Data'];
        this.spinner.hide();
      }, error => {
        this.global.displayError(error);
        this.spinner.hide();
      }
    );
  }
  handleAdd() {
    this.formAdd.patchValue({
      code: '',
      name: '',
      type: '',
      create_user: this.identity.strUsuario
    });
    this.myFileInputAdd.nativeElement.value = '';
    this.displayAdd = true;
  }
  saveFirma() {
    this.spinner.show();
    this.firmaService.saveFirma(this.formAdd.value).subscribe(
      response => {
        this.displayAdd = false;
        this.global.showNotification(response['message'], 'success');
        this.spinner.hide();

        this.makeFileRequest(this.url + 'firma/upload-image/' + response['firma']._id, [], this.filesToUpload).then(
          (result: any) => {
            this.global.showNotification(result['message'], 'success');
            this.searchFirmas();
          }
        );
        if (this.filesToUpload === undefined) {
          this.searchFirmas();
        }
      }, error => {
        this.global.displayError(error);
        this.spinner.hide();
      }
    );
  }

  handleEdit(item) {
    this.idEditFirma = item._id;
    this.itemEdit = item;
    this.formEdit.patchValue({
      code: item.code,
      name: item.name,
      type: item.type,
      status: item.status
    });
    this.myFileInputEdit.nativeElement.value = '';
    this.displayEdit = true;
  }
  updateFirma() {
    this.spinner.show();
    this.firmaService.updateFirma(this.formEdit.value, this.idEditFirma).subscribe(
      response => {
        this.displayEdit = false;
        this.global.showNotification(response['message'], 'success');
        this.spinner.hide();

        this.makeFileRequest(this.url + 'firma/upload-image/' + this.idEditFirma, [], this.filesToUpload).then(
          (result: any) => {
            this.global.showNotification(result['message'], 'success');
            this.searchFirmas();
          }
        );
        if (this.filesToUpload === undefined) {
          this.searchFirmas();
        }
      }, error => {
        this.global.displayError(error);
        this.spinner.hide();
      }
    );
  }

  // Subir imagen
  fileChangeEvent(fileInput: any) {
    this.filesToUpload = <Array<File>>fileInput.target.files;
  }

  makeFileRequest(url: string, params: Array<string>, files: Array<File>) {
    let token = this.global.getToken();
    return new Promise((resolve, reject) => {
      let formData: any = new FormData();
      let xhr = new XMLHttpRequest();
      if (files !== undefined) {
        for (let i = 0; i < files.length; i++) {
          formData.append('firm', files[i], files[i].name);
        }
        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              resolve(JSON.parse(xhr.response));
            } else {

            }
          }
        };
        xhr.open('POST', url, true);
        xhr.setRequestHeader('Authorization', token);
        xhr.send(formData);
      }
    });
  }
}
