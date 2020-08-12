import { Injectable } from '@angular/core';
import { Usuario } from './usuario';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient} from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import swal from 'sweetalert2';
import { Router} from '@angular/router';
import { AuthService } from './auth.service';

import { URL_BACKEND_ZUUL } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private urlEndPoint : string = URL_BACKEND_ZUUL + '/api/socialweb-usuarios/usuarios';

  constructor(private http : HttpClient, private router : Router, private authService: AuthService) { }

  getUsuario(): Observable<Usuario>{  
  
    //this.usuario = {id:1, nombre:'jose', apellidos:'da silva', email:'jdasilva@gmailc.om', fechaNacimiento:'27/02/1968', fechaAlta:'27/02/2009', username:'jdasilva', activo:true, foto:'foto.png', intentos:4};
    //return of(this.usuario);
    
    //return this.http.get<Usuario>(this.urlEndPoint);

    return this.http.get(`${this.urlEndPoint}/${this.authService.usuario.id}`).pipe(

        catchError( (e) =>{

          swal.fire('Error al obtener los datos del usuario', e.error.mensaje, 'error');
          return throwError(e);
        }
      )
    ).pipe(
      
      map( response => response as Usuario)
    );
  }
}
