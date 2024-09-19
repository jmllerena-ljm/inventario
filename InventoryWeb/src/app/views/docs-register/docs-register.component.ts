import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DocsRegisterService } from '../../services/docsRegister.service';
import { EmailService } from '../../services/email.service';
import { GlobalService } from '../../services/Global';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AccessControlModel, AccessControlService } from '../../services/accessControl.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-docs-register',
  templateUrl: './docs-register.component.html',
  styleUrls: ['./docs-register.component.scss']
})
export class DocsRegisterComponent implements OnInit {
  identity: any = null;
  accessLevel: AccessControlModel = { Id: -1, NivelAcceso: false, Download: false, SuperUser: false };
  gridData: any = [];
  formSearch: FormGroup;
  displayAdd: Boolean = false;
  displayEdit: Boolean = false;
  displaySendEmail: Boolean = false;
  formAdd: FormGroup;
  formEdit: FormGroup;
  formEmail: FormGroup;
  itemEdit: any = {};
  idEditDoc: string;
  countData = 0;
  pageIndex = 1;
  pageSize = 50;

  dataOrigen: any = [
    { name: 'Interno', value: 'Int' },
    { name: 'Externo', value: 'Ext' },
    { name: 'Interno-Externo', value: 'Int-Ext' },
    { name: 'Salida', value: 'Salio' },
  ];

  // Upload
  url: String = '';
  filesToUpload: Array<File>;
  @ViewChild('fileInputAdd', {static: false}) myFileInputAdd: ElementRef;
  @ViewChild('fileInputEdit', {static: false}) myFileInputEdit: ElementRef;
  fileInputEdit
  constructor(
    private docRegisterService: DocsRegisterService,
    private emailService: EmailService,
    private global: GlobalService,
    private spinner: NgxSpinnerService,
    private accessControl: AccessControlService
  ) {
    this.formSearch = new FormGroup({
      date_ini: new FormControl(''),
      date_fin: new FormControl(''),
      sender: new FormControl(''),
      doc_type: new FormControl(''),
      issue: new FormControl(''),
      reference: new FormControl(''),
      area: new FormControl(''),
    });
    this.formAdd = new FormGroup({
      date: new FormControl(''),
      sender: new FormControl(''),
      doc_type: new FormControl(''),
      issue: new FormControl('', Validators.required),
      reference: new FormControl(''),
      area: new FormControl(''),
      observations: new FormControl(''),
      other_data: new FormControl('', Validators.required),
      create_user: new FormControl(''),
    });
    this.formEdit = new FormGroup({
      sender: new FormControl(''),
      doc_type: new FormControl(''),
      issue: new FormControl('', Validators.required),
      reference: new FormControl(''),
      area: new FormControl(''),
      observations: new FormControl(''),
      other_data: new FormControl('', Validators.required),
      update_user: new FormControl(''),
    });
    this.formEmail = new FormGroup({
      to: new FormControl('', Validators.required),
      cc: new FormControl(''),
      subject: new FormControl('', Validators.required),
      html: new FormControl('', Validators.required)
    });

    this.url = global.getUrl();
  }

  ngOnInit() {
    this.identity = this.global.getIdentity();
    if (this.identity === null) {
      this.global.goToLogin();
    } else {
      this.accessLevel = this.accessControl.checkAccess(this.identity.strUsuario, 'ACC-007');
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
    this.searchDocsRegister();
  }

  // BUSQUEDA
  searchDocsRegister() {
    this.spinner.show();
    this.docRegisterService.searchDocsRegister(this.formSearch.value).subscribe(
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


  // CREAR
  handleAdd() {
    this.formAdd.patchValue({
      date: this.global.getParseDate(new Date),
      sender: '',
      doc_type: '',
      issue: '',
      reference: '',
      area: '',
      observations: '',
      other_data: '',
      create_user: this.identity.strUsuario
    });
    this.myFileInputAdd.nativeElement.value = '';
    this.displayAdd = true;
  }
  saveDocRegister() {
    this.spinner.show();
    this.docRegisterService.saveDocRegister(this.formAdd.value).subscribe(
      response => {
        this.displayAdd = false;
        this.global.showNotification(response['message'], 'success');
        this.spinner.hide();

        this.makeFileRequest(this.url + 'docs-register/upload-document/' + response['Data']._id, [], this.filesToUpload).then(
          (result: any) => {
            this.global.showNotification(result['message'], 'success');
            this.searchDocsRegister();
          }
        );
        if (this.filesToUpload === undefined) {
          this.searchDocsRegister();
        }
      }, error => {
        this.global.displayError(error);
        this.spinner.hide();
      }
    );
  }

  handleEdit(item) {
    this.idEditDoc = item._id;
    this.itemEdit = item;
    this.formEdit.patchValue({
      sender: item.sender,
      doc_type: item.doc_type,
      issue: item.issue,
      reference: item.reference,
      area: item.area,
      observations: item.observations,
      other_data: item.other_data,
      update_user: this.identity.strUsuario
    });
    this.myFileInputEdit.nativeElement.value = '';
    if (this.itemEdit.state === 'borrador') {
      this.formEdit.enable();
    } else {
      this.formEdit.disable();
    }
    this.displayEdit = true;
  }
  updateDocRegister() {
    this.spinner.show();
    this.docRegisterService.updateDocRegister(this.formEdit.value, this.idEditDoc).subscribe(
      response => {
        this.displayEdit = false;
        this.global.showNotification(response['message'], 'success');
        this.spinner.hide();
        this.makeFileRequest(this.url + 'docs-register/upload-document/' + response['Data']._id, [], this.filesToUpload).then(
          (result: any) => {
            this.global.showNotification(result['message'], 'success');
            this.searchDocsRegister();
          }
        );
        if (this.filesToUpload === undefined) {
          this.searchDocsRegister();
        }
      }, error => {
        this.global.displayError(error);
        this.spinner.hide();
      }
    );
  }

  approveDocRegister() {
    this.spinner.show();
    this.docRegisterService.approveDocRegister(this.idEditDoc).subscribe(
      response => {
        this.displayEdit = false;
        this.global.showNotification(response['message'], 'success');
        this.spinner.hide();
        this.searchDocsRegister();
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
          formData.append('document', files[i], files[i].name);
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

  // ENVIAR EMAIL PROVEEDOR
  handleSendMail(item) {
    let _link = this.url + 'docs-register/get-document/' + item.images_path
    let _doc = (item.images_path !== '') ? `Para ver el documento haga click <a href="${_link}" target="_blank"><u>AQUI</u><a>` : '';
    let _message =
    `Nuevo Documento N° <b>${item.code}</b><br>
    Se registro un nuevo documento ingresado a oficina:<br>
    <div>
      <b>Fecha:</b> ${this.global.getParseDate(item.date)}</br>
      <b>Asunto:</b> ${item.issue}</br>
      <b>Remitente:</b> ${item.sender}</br>
      <b>Tipo de Documento:</b> ${item.doc_type}</br>
      <b>Referencia:</b> ${item.reference}</br>
    </div>
    ${_doc}
    <br>
    <b>MRP</b></br>
    La Joya Mining SAC.`;

    this.formEmail.patchValue({
      to: '',
      cc: this.identity.strEmail,
      subject: 'MRP - Nuevo Documento Nro ' + item.code,
      html: _message
    });
    this.displaySendEmail = true;
  }
  SendMail() {
    this.spinner.show();
    let email = {
      to: this.formEmail.value.to,
      cc: this.formEmail.value.cc,
      subject: this.formEmail.value.subject,
      html: this.formEmail.value.html.split('\n').join('<br/>')
    }
    this.emailService.sendMail(email).subscribe(
      response => {
        this.spinner.hide();
        this.global.showNotification(response['message'], 'success');
        this.displaySendEmail = false;
      }, error => {
        this.global.displayError(error);
        this.spinner.hide();
      }
    )
  }

  handlePage(e: any) {
    this.pageIndex = e.pageIndex + 1;
    this.pageSize = e.pageSize;
    this.searchDocsRegister();
  }

}
