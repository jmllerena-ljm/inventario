import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from '../../../services/Global';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  identity: any = null;
  constructor(private router: Router, private global: GlobalService) { }

  ngOnInit() {
    this.identity = this.global.getIdentity();
    // this.UsuarioLogeado = user.strUsuario;
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/']);
  }

}
