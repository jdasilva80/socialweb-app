import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import swal from 'sweetalert2'; 

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private authService:AuthService, private router:Router){    
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
 
    if(this.authService.isAuthenticated()){
      
      if(!this.isTokenExpired()){       

        let role = next.data['role'] as string;

        if(this.authService.hasRole(role)){
          return true;
        }  
        swal.fire('Acceso denegado',`Hola ${this.authService.usuario.username} no tienes permiso para hacer esta acción`,'warning');
      }else{
        swal.fire('Token expirado',`Hola ${this.authService.usuario.username} debes volver a iniciar sesión`,'warning');
      }
    }   
    this.router.navigate(['/login']);
    return false;
  }
  
  isTokenExpired() : boolean{

    let token = this.authService.token;
    let payload = this.authService.obtenerDatosToken(token);
    let now = new Date().getTime() / 1000;

    if(payload.exp < now){
      return true
    }
    return false;
  }
}
