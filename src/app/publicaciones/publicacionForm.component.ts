import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { Publicacion } from './publicacion';
import { PublicacionService } from './publicacion.service';
import { ModalService} from './modal.service'
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2'
import { AuthService } from '../usuarios/auth.service';
import { URL_BACKEND } from '../config/config';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-form-publicacion',
  templateUrl: './publicacionForm.component.html',
  styleUrls: ['./publicacionForm.component.css']
})
export class PublicacionFormComponent implements OnInit, AfterViewInit{

  @Input() public publicacion: Publicacion = new Publicacion();
  public titulo: string = 'Publicación';
  public errores: string[]; // será los errores devueltos por el responseEntity del backend.
  public foto: File;
  oldMensaje:string;
  @Input() paginaInjectada : number;
  urlBackend : string = URL_BACKEND;
  progreso : number = 0;

  constructor(private publicacionService: PublicacionService, private router : Router,
              private activatedRoute : ActivatedRoute, public modalService : ModalService,
              public authService: AuthService) { }
  
  ngAfterViewInit(): void {
    this.oldMensaje = this.publicacion.mensaje;
  }

  ngOnInit(): void {
    //this.cargarPublicacion();
  }

  cargarPublicacion() :void{
    
    this.activatedRoute.params.subscribe(
      
      (params) => {
          
        let id = params['id'];
        this.paginaInjectada = id;

        if(id){

          this.publicacionService.getPublicacion(id).subscribe(
           
            (event) => {
      
              if(event.type === HttpEventType.DownloadProgress){
        
                this.progreso = 1;
        
              }else if(event.type === HttpEventType.Response){

                this.publicacion = event.body as Publicacion;
                this.progreso = 0;
              }
          })
        }
      }
    )
  }
  
 // crear() : void{

  //  this.publicacionService.create(this.publicacion, this.authService.usuario).subscribe( 

    //  (response) => {

      //  this.router.navigate(['/publicaciones']);
      //  swal.fire('Nueva publicación', `se ha creado la publicación : ${response.publicacion.id}`, 'success');
      // })
  //}

  crearConFoto() : void{

    if(!this.foto){

      swal.fire('Error', `debe seleccionar una imagen`, 'error');

    }else{

      this.publicacionService.crearConFoto(this.publicacion, this.authService.usuario.id, this.foto).subscribe( 

        (event) => {
      
          if(event.type === HttpEventType.UploadProgress){
    
            this.progreso = Math.round((event.loaded / event.total) * 100);
    
          }else if(event.type === HttpEventType.Response){

            this.progreso = 0;
            let response:any = event.body as Publicacion;
            this.router.navigate(['/publicaciones/page/', 0]);            
            this.modalService.notificarUpload.emit(response.publicacion);
                   
            this.cerrarModal();                      
            swal.fire('Nueva publicación', `se ha creado la publicación : ${response.publicacion.id}`, 'success');
          }
      })
   }
  }

  seleccionarFoto(event){
    
    if(event.target.files[0].type.indexOf('image') < 0 ){

      swal.fire('Error', `debe seleccionar una imagen, no un tipo : ${event.target.files[0].type}`, 'error');
      this.foto = null;

    }else{
      
       this.foto = event.target.files[0];
    }   
  }

  /*
  actualizar() : void{

      this.publicacionService.update(this.publicacion).subscribe( 

        (response) => {

          this.router.navigate(['/publicaciones']);
          swal.fire('Publicación actualizada', `se ha actualizado la publicación : ${response.publicacion.id}`, 'success');
        },
          e =>{
            this.errores = e.error.errores as string[];
          }
        )
      
  }*/

    actualizarConFoto() : void{

      if(!this.foto){

        swal.fire('Error', `debe seleccionar una imagen`, 'error');

      }else{

        this.publicacionService.actualizarConFoto(this.publicacion, this.foto).subscribe( 
          (event) => {
      
            if(event.type === HttpEventType.UploadProgress){
      
              this.progreso = Math.round((event.loaded / event.total) * 100);
      
            }else if(event.type === HttpEventType.Response){
              
              this.progreso = 0;
              let response:any = event.body as Publicacion;
              this.modalService.notificarUpload.emit(response.publicacion);
              swal.fire('Publicación actualizada', `se ha actualizado la publicación : ${response.publicacion.id}`, 'success');
              this.cerrarModal();            
              this.router.navigate(['/publicaciones/page/',this.paginaInjectada]);
             
            }
          })          
        }
    }

  cerrarModal(){

    this.publicacion.mensaje = this.oldMensaje;
    this.modalService.cerrarModal();
    this.foto = null;
  }
}  