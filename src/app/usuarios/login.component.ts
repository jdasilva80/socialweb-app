import { Component, OnInit } from '@angular/core';
import { Usuario } from './usuario';
import { AuthService } from './auth.service'
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  titulo:string = 'Sign in';
  usuario: Usuario;
  cargando:boolean= false;

  constructor(private authService : AuthService, private router : Router) { 

    this.usuario = new Usuario();
  }

  ngOnInit(): void {

    if(this.authService.isAuthenticated()){
      swal.fire('Login', `Hola ${this.authService.usuario.username} ya estás autenticado`, 'info');
      this.router.navigate(['/publicaciones']);
    }
  }

  login(): void {

    if (this.usuario.username == null || this.usuario.password == null) {

      swal.fire('Error Login', 'Username o password vacías!', 'error');
      return;
    }

    this.authService.login(this.usuario).subscribe(event => {
      
      if(event.type === HttpEventType.UploadProgress){

        //this.progreso = Math.round((event.loaded / event.total) * 100);
        this.cargando = true;

      }else if(event.type === HttpEventType.Response){
              
        this.cargando = false;
        let response:any = event.body;
        this.authService.guardarUsuario(response.access_token);
        this.authService.guardarToken(response.access_token);
        //this.authService.guardarUsuario(response.access_token);
        //this.authService.guardarToken(response.access_token);
        //let usuario = this.authService.usuario;
        this.usuario= this.authService.usuario;
        this.router.navigate(['/publicaciones']);  
        swal.fire('Login', `Hola ${this.usuario.username}, has iniciado sesión con éxito!`, 'success');

      }
    }, err => {
      this.cargando = false;
      if (err.status > 400 || err.status < 500) {
        swal.fire('Error Login', 'Usuario o clave incorrectas!', 'error');
      }
    });
  }

}
