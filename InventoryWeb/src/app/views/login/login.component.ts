import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { GlobalService } from '../../services/Global';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  forma: FormGroup;
  constructor(
    private router: Router,
    private usuarioService: UsuarioService,
    private global: GlobalService,
    private spinner: NgxSpinnerService
    ) {
    this.forma = new FormGroup({
      strUsuario: new FormControl('', Validators.required),
      strPassword: new FormControl('', Validators.required)
    });
  }

  ngOnInit() {
  }

  IngresarSistema() {
    this.spinner.show();
    this.usuarioService.LoginOdooUsuario(this.forma.value, 'true').subscribe(
      response => {
        localStorage.setItem('session_token', response['token']);
        localStorage.setItem('session_user', JSON.stringify(response['usuario']));
        localStorage.setItem('session_access', JSON.stringify(response['accesos']));
        this.router.navigate(['menu/dashboard']).then(() => {
          this.spinner.hide();
          window.location.reload();
          this.global.showNotification(response['message']);
        });
      }, error => {
        console.error(error);
        this.spinner.hide();
        this.global.showNotification(error.error.message, 'danger');
      }
    );
  }

}
