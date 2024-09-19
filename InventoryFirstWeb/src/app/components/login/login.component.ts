import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  forma: FormGroup;
  constructor(private router: Router, private usuarioService: UsuarioService, private toastr: ToastrService) {
    this.forma = new FormGroup({
      strUsuario: new FormControl('', Validators.required),
      strPassword: new FormControl('', Validators.required)
    });
  }

  ngOnInit() {
  }

  IngresarSistema() {
    this.usuarioService.LoginUsuario(this.forma.value, 'true').subscribe(
      response => {
        this.toastr.success(response['message'], 'Success');
        localStorage.setItem('session_token', response['token']);
        localStorage.setItem('session_user', JSON.stringify(response['usuario']));
        this.router.navigate(['menu/dashboard']);
      }, error => {
        console.error(error);
        this.toastr.error(error.error.message, 'Error');
      }
    );
  }

}
