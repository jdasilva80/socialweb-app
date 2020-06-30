import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable, throwError} from 'rxjs';
import { catchError} from 'rxjs/operators';
import { AuthService } from 'src/app/usuarios/auth.service';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { ModalService } from '../modal.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService:AuthService, private router : Router, private modalService : ModalService){}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {    
    
    return next.handle(req).pipe(
      catchError(
        (e) =>{
          if (e.status == 401) {
            //para cuando el token ha expirado en el backend obtenemos un 401.
            if(!this.authService.isAuthenticated()){
              this.authService.logout();
            }
            this.router.navigate(['/login']);
          }
          if (e.status == 403) {            
            swal.fire('Acceso denegado',`Hola ${this.authService.usuario.username} no tienes permiso para acceder`,'warning');
            this.modalService.cerrarModal();
            this.router.navigate(['/publicaciones']);
          }
          return throwError(e);
        }
      )
    );
  }
}
