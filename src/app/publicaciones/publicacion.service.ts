import { Injectable, SystemJsNgModuleLoader } from '@angular/core';
import { Publicacion } from './publicacion';
import { Observable, of, throwError} from 'rxjs';
import { map, catchError, tap} from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpRequest, HttpEvent} from '@angular/common/http';
import swal from 'sweetalert2';
import { Router} from '@angular/router';
//import { formatDate, DatePipe} from '@angular/common';
import { AuthService } from '../usuarios/auth.service';
import { ModalService } from './modal.service';
import { URL_BACKEND, URL_BACKEND_ZUUL} from '../config/config';
import { Comentario } from '../comentarios/comentario';

@Injectable({
  providedIn: 'root'
})
export class PublicacionService {

  private urlEndPointPublicacionesUsuario : string = URL_BACKEND + '/publicaciones/contactos/usuario';
  //private urlEndPointPost : string = 'http://localhost:8090/api/socialweb/publicaciones/form';
  private urlEndPointPostConFoto : string = URL_BACKEND + '/publicaciones/formmultipartfile';
  private urlEndPointGetPutDelete : string = URL_BACKEND + '/publicaciones';
  private urlEndPointPutConFoto : string = URL_BACKEND + '/publicaciones/formmultipartfile';
  private urlEndPointPublicacionesLike : string = URL_BACKEND + '/likespublicaciones';
  private urlEndPointComentarios : string = URL_BACKEND + '/comentarios';
  //private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'})
  private httpHeaders = new HttpHeaders();

  constructor(private http : HttpClient, private router : Router, private authService: AuthService,
              public modalService : ModalService) { }


  getPublicacionesUsuario():Observable<Publicacion[]>{

    return this.http.get(`${this.urlEndPointPublicacionesUsuario}/${this.authService.usuario.id}`).pipe(

      map( (response) =>{

          let publicaciones = response as Publicacion[];
         // publicaciones.map(
         //   (publicacion) =>{      
         //       publicacion.fecha = formatDate(publicacion.fecha , 'EEEE dd-MM-yyyy','en-US');              
         //   }
         // );
          return publicaciones;
      }),
      tap(
        //los tap no modifican los datos, pero permiten hacer operaciones, tareas, asignar valores a variables..
        (publicaciones) => publicaciones.forEach( (publicacion) => console.log(publicacion.mensaje))
      )
    )
  }

  getPublicacionesUsuarioPaginado(page:number):Observable<HttpEvent<{}>>{

    const req = new HttpRequest('GET', `${this.urlEndPointPublicacionesUsuario}/${this.authService.usuario.id}/page/${page}`, {
      reportProgress: true
    });

    return this.http.request(req);
  }

  postMeGusta(publicacion:Publicacion):Observable<HttpEvent<{}>>{

    const req = new HttpRequest('POST', `${this.urlEndPointPublicacionesLike}/${publicacion.id}/usuario/${this.authService.usuario.id}`, {
      reportProgress: true
    });

    return this.http.request(req);
  }

  postComentario(publicacion:Publicacion, comentario:string):Observable<Comentario>{

    let formData = new FormData();
    formData.append("mensaje", comentario);
    //formData.append('publicacion', JSON.stringify(publicacion));
    formData.append('publicacion', new Blob([JSON.stringify(publicacion)], {type: "application/json"}));

    return this.http.post<Comentario>(`${this.urlEndPointComentarios}/usuario/${this.authService.usuario.id}`, formData,{headers: this.httpHeaders} ).pipe(
      
      catchError( (e) =>{

          this.router.navigate(['/publicaciones']);
          swal.fire('Error al crear la publicación', e.error.mensaje, 'error');
          return throwError(e);
        }
      )
    );
  }

  getMeGustas(publicacion:Publicacion):Observable<HttpEvent<{}>>{

    const req = new HttpRequest('GET', `${this.urlEndPointPublicacionesLike}/${publicacion.id}`, {
      reportProgress: true
    });

    return this.http.request(req);
  }

  /*
  create(publicacion:Publicacion, usuarioId:number):Observable<any>{
    
    publicacion.usuarioId = usuarioId;
  
    return this.http.post<any>(this.urlEndPointPost, publicacion, {headers: this.httpHeaders} ).pipe(
      
      catchError( (e) =>{

          this.router.navigate(['/publicaciones']);
          swal.fire('Error al crear la publicación', e.error.mensaje, 'error');
          return throwError(e);
        }
      )
    );
  }
  */

  crearConFoto(publicacion:Publicacion, usuarioId:number, archivo: File):Observable<HttpEvent<{}>>{
    
    publicacion.usuarioId = usuarioId;

    let formData = new FormData();
    formData.append("file", archivo);
    //formData.append('publicacion', JSON.stringify(publicacion));
    formData.append('publicacion', new Blob([JSON.stringify(publicacion)], {type: "application/json"}));

    const req = new HttpRequest('POST', this.urlEndPointPostConFoto, formData, {
      reportProgress: true
    });

    return this.http.request(req).pipe(
      
      catchError( (e) =>{
       
        if(e.status != 401){
          this.router.navigate(['/publicaciones']);
          swal.fire('Error al crear la publicación', e.error.mensaje, 'error');         
        }
        return throwError(e);
      })
    );
  }

  getPublicacion(idPublicacion:number) : Observable<HttpEvent<{}>>{

    const req = new HttpRequest('GET', `${this.urlEndPointGetPutDelete}/${idPublicacion}`, {
      reportProgress: true
    });

    return this.http.request(req).pipe(
      
      catchError( (e) =>{

          if(e.status != 401){
            this.router.navigate(['/publicaciones']);
            swal.fire('Error al obtener la publicación', e.error.mensaje, 'error');
          }
          return throwError(e);
        }
      )
    );
  }

  actualizarConFoto(publicacion : Publicacion, archivo: File) : Observable<any>{

    let formData = new FormData();
    formData.append("file", archivo);
    formData.append('publicacion', new Blob([JSON.stringify(publicacion)], {type: "application/json"}));

    const req = new HttpRequest('PUT', `${this.urlEndPointPutConFoto}/${publicacion.id}`, formData, {
      reportProgress: true
    });

    return this.http.request(req).pipe(

      catchError( (e) =>{

          if(e.status == 400){
            //bad request
            //return throwError(e);
          }
          swal.fire('Error al actualizar la publicación', e.error.mensaje, 'error');
          return throwError(e);
        }
      )
    );
  }

  /*
  update(publicacion : Publicacion) : Observable<any>{

    return this.http.put<any>(`${this.urlEndPointGetPutDelete}/${publicacion.id}`, publicacion, {headers: this.httpHeaders} ).pipe(
      
      catchError( (e) =>{

          if(e.status == 400){
            //bad request
            //return throwError(e);
          }

          swal.fire('Error al actualizar la publicación', e.error.mensaje, 'error');
          return throwError(e);
        }
      )
    );
  }*/

  delete(publicacionId:number) : Observable<any>{

    return this.http.delete<any>(`${this.urlEndPointGetPutDelete}/${publicacionId}`).pipe(
      
      catchError( (e) =>{
          swal.fire('Error al eliminar la publicación', e.error.mensaje, 'error');
          return throwError(e);
        }
      )
    );
  }
}
