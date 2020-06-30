import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/usuarios/auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private authService:AuthService){}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    // Get the auth token from the service.
    const authToken = this.authService.token;

    if(authToken != null){
      // Clone the request and replace the original headers with
      // cloned headers, updated with the authorization.
      // el objeto request es inmutable por eso hay que clonarlo
      const authReq = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + authToken)
      });
      // send cloned request with header to the next handler.
      return next.handle(authReq);
    }    
    return next.handle(req);

  }
}
