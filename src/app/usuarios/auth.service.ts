import { Injectable } from '@angular/core';
import { Usuario } from './usuario';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpRequest, HttpEvent } from '@angular/common/http';

import { URL_BACKEND_OAUTH2 } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _usuario: Usuario;
  private _token: string;

  constructor(private http: HttpClient) { }

  public get usuario():Usuario{

    if(this._usuario != null){
      return this._usuario;
    }else if(this._usuario == null && sessionStorage.getItem('usuario')!=null){
      this._usuario = JSON.parse(sessionStorage.getItem('usuario')) as Usuario;
      return this._usuario;
    }   
    return new Usuario();
  }

  public get token():string{

    if(this._token != null){
      return this._token;
    }else if(this._token == null && sessionStorage.getItem('token')!=null){
      this._token = sessionStorage.getItem('token');
      return this._token;
    }   
    return null;
  }

  login(usuario: Usuario): Observable<HttpEvent<{}>> {

    const urlEndpoint = URL_BACKEND_OAUTH2 + '/oauth/token';

    const credenciales = btoa('frontendapp' + ':' + '12345');
     /*
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + credenciales
    });
   
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + credenciales,
      'Access-Control-Allow-Credentials' : 'true',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With',
    })
    */
    let params = new URLSearchParams();
    params.set('grant_type', 'password');
    params.set('username', usuario.username);
    params.set('password', usuario.password);
    
    const req = new HttpRequest('POST', urlEndpoint, params.toString(), {
      reportProgress: true
    });
    const req2 = req.clone({
      headers: req.headers.set('Content-Type', 'application/x-www-form-urlencoded')
    });
    const req3 = req.clone({
      headers: req2.headers.set('Authorization','Basic ' + credenciales)
    });

    return this.http.request(req3);
    /*
    return this.http.post<any>(urlEndpoint, params.toString(), { headers: httpHeaders });
    
    const formData = new FormData();
    formData.append('grant_type', 'password');
    formData.append('username', usuario.username);
    formData.append('password', usuario.password);
    var content = '<a id="a"><b id="b">hey!</b></a>'; // the body of the new file...
    var blob = new Blob([content], { type: "text/xml"});
    formData.append("webmasterfile", blob);
    return this.http.post<any>(urlEndpoint, formData, { headers: httpHeaders });
    */
  }
  
  guardarUsuario(accessToken:string):void{

    this._usuario = new Usuario();
    let payload = this.obtenerDatosToken(accessToken);
    this._usuario.nombre = payload.nombre;
    this._usuario.apellidos = payload.apellidos;
    this._usuario.email = payload.email;
    this._usuario.username = payload.user_name;
    this._usuario.roles = payload.authorities;
    this._usuario.id= payload.id;
    sessionStorage.setItem('usuario', JSON.stringify(this._usuario));
  }

  guardarToken(accessToken:string):void{

    this._token = accessToken;
    sessionStorage.setItem('token', accessToken);
  }

  obtenerDatosToken(accessToken:string):any{

    if(accessToken != null && accessToken != undefined){
      return JSON.parse(atob(accessToken.split(".")[1]));
    }
    return null;
  }

  isAuthenticated():boolean{

    let payload = this.obtenerDatosToken(this.token);
    if(payload!=null && payload.user_name && payload.user_name.length>0){
      return true;
    }
    return false;
  }

  logout():void{
    this._usuario = null;
    this._token = null;
    sessionStorage.removeItem('usuario');
    sessionStorage.removeItem('token');
  }

  hasRole(role:string){

    if(this.usuario.roles.includes(role)){
        return true;
    }
    return false;
  }
}
