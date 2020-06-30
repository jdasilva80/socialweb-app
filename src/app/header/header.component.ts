import { Component, OnInit } from '@angular/core';
import { AuthService } from '../usuarios/auth.service';
import swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private _authService:AuthService, private router:Router) { }

  public get authService():AuthService{
    return this._authService;
  }

  ngOnInit(): void {
  }

  logout():void{
    
    swal.fire('Logout',`${this.authService.usuario.username} has cerrado sessión!`,'success');
    this.router.navigate(['\login']);
    this.authService.logout();
  }
}
