import { Injectable, SystemJsNgModuleLoader } from '@angular/core';
import { Publicacion } from './publicacion';
import { Observable, of, throwError} from 'rxjs';
import { map, catchError, tap} from 'rxjs/operators';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import swal from 'sweetalert2';
import { Router} from '@angular/router';
//import { formatDate, DatePipe} from '@angular/common';
import { AuthService } from '../usuarios/auth.service';
import { ModalService } from './modal.service';

@Injectable({
  providedIn: 'root'
})
export class PublicacionService {

  private urlEndPointPublicacionesUsuario : string = 'http://localhost:8090/api/socialweb/publicaciones/contactos/usuario';
  //private urlEndPointPost : string = 'http://localhost:8090/api/socialweb/publicaciones/form';
  private urlEndPointPostConFoto : string = 'http://localhost:8090/api/socialweb/publicaciones/formmultipartfile';
  private urlEndPointGetPutDelete : string = 'http://localhost:8090/api/socialweb/publicaciones';
  private urlEndPointPutConFoto : string = 'http://localhost:8090/api/socialweb/publicaciones/formmultipartfile';
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

  getPublicacionesUsuarioPaginado(page:number):Observable<any>{

    return this.http.get(`${this.urlEndPointPublicacionesUsuario}/${this.authService.usuario.id}/page/${page}`);
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

  crearConFoto(publicacion:Publicacion, usuarioId:number, archivo: File):Observable<any>{
    
    publicacion.usuarioId = usuarioId;

    let formData = new FormData();
    formData.append("file", archivo);
    //formData.append('publicacion', JSON.stringify(publicacion));
    formData.append('publicacion', new Blob([JSON.stringify(publicacion)], {type: "application/json"}));

    return this.http.post<any>(this.urlEndPointPostConFoto, formData, { reportProgress: true}).pipe(
      
      catchError( (e) =>{
       
        if(e.status != 401){
          this.router.navigate(['/publicaciones']);
          swal.fire('Error al crear la publicación', e.error.mensaje, 'error');         
        }
        return throwError(e);
      })
    );
  }

  getPublicacion(idPublicacion:number) : Observable<any>{

    return this.http.get<any>(`${this.urlEndPointGetPutDelete}/${idPublicacion}`).pipe(
      
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

    return this.http.put<any>(`${this.urlEndPointPutConFoto}/${publicacion.id}`, formData).pipe(

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
