import { Component, OnInit, ViewChild, Renderer2, ElementRef } from '@angular/core';
import { PublicacionService } from './publicacion.service';
import { ModalService} from './modal.service'
import { Publicacion } from './publicacion';
import { Router, ActivatedRoute} from '@angular/router';
import  swal from 'sweetalert2';
import { AuthService } from '../usuarios/auth.service';

import { URL_BACKEND } from '../config/config';
import { HttpEventType } from '@angular/common/http';
import { ITS_JUST_ANGULAR } from '@angular/core/src/r3_symbols';
import { RenderFlags } from '@angular/compiler/src/core';
import { MessageSpan } from '@angular/compiler/src/i18n/i18n_ast';

@Component({
  selector: 'app-publicaciones',
  templateUrl: './publicaciones.component.html',
  styleUrls: ['./publicaciones.component.css']
})
export class PublicacionesComponent implements OnInit {

  @ViewChild("numLikes") numLikes: ElementRef;
  @ViewChild("buttonLikes") buttonLikes: ElementRef;
  @ViewChild("comentario") comentario: ElementRef;
  @ViewChild("comentarios") comentarios: ElementRef;
  @ViewChild("comentariosUsuario") comentariosUsuario: ElementRef;
  @ViewChild("comentariosMensaje") comentariosMensaje: ElementRef;
  publicaciones : Publicacion[];  
  paginador : any;
  publicacionSeleccionada : Publicacion;
  pagina : number;
  urlBackend : string = URL_BACKEND;
  cargando : boolean;
  
  constructor(private publicacionService: PublicacionService, private router : Router,
              private activatedRoute : ActivatedRoute, private modalService : ModalService,
              public authService: AuthService, private renderer: Renderer2) { }

  ngOnInit(): void {

    this.activatedRoute.paramMap.subscribe( 
      
      (params) => {

        let page:number = +params.get('page');// para transformarlo a number
        
        if(!page){
          page = 0;
        }
        this.pagina = page;
        this.cargando = true;
        
        this.publicacionService.getPublicacionesUsuarioPaginado(page).subscribe( event => {
          
          if(event.type === HttpEventType.Response){

            let response:any = event.body;
            this.publicaciones = response.content as Publicacion[];
            this.paginador = response;
            this.cargando = false;
          }
        });

      }
    )
    //para refrescar en el listado las fotos cuando se sube o se actualiza una publicación.(EventEmmiter)
    this.modalService.notificarUpload.subscribe(
      
      (publicacion) =>{

        this.publicaciones = this.publicaciones.map( 

         (publicacionOriginal) => {
           
           if(publicacionOriginal.id == publicacion.id){            
             publicacionOriginal.imagen = publicacion.imagen;
           }
           return publicacionOriginal;
         }
        )
      }
    )
  }
  

  borrar(publicacionId : number) : void{

    swal.fire({

      title: 'Estás seguro?',
      text: "Será irreversible !",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, borralo!'

    }).then((result) => {

      this.publicacionService.delete(publicacionId).subscribe( 

        (response) => {
                    
          this.publicaciones= this.publicaciones.filter( (p) => p.id != publicacionId );       
          this.router.navigate(['/publicaciones/page/', this.pagina>0 ? this.pagina-1 : 0]);          
          swal.fire('atención', `publicacion eliminada con id ${publicacionId}`, 'success');   
      })
    })   
  }

  abrirModal(publicacion : Publicacion){
   
    if(publicacion != null){
     this.publicacionSeleccionada = publicacion;
    }else{
      this.publicacionSeleccionada = new Publicacion()
    }
    this.modalService.abrirModal();
  }

  meGusta(publicacion : Publicacion) :number{

    if(publicacion != null){
      this.publicacionService.postMeGusta(publicacion).subscribe( event => {
        
        this.buttonLikes.nativeElement.disabled = true;

        if(event.type === HttpEventType.Response){

          this.buttonLikes.nativeElement.disabled = false;

          let response:number = event.body as number;          
          //this.numLikes.nativeElement.innerHTML = +this.numLikes.nativeElement.innerHTML + response;
          this.numLikes.nativeElement.innerHTML = response;
          return response;
        }        
      });
    }
    return 0;
  }

  handleKeyDown(publicacion:Publicacion, event: any, comentario:string)
  {
    if (event.keyCode == 13)//press enter
    {      
      this.comentario.nativeElement.disabled = true;
      this.publicacionService.postComentario(publicacion, comentario).subscribe( response => {
        this.comentario.nativeElement.disabled = false;     
        //this.comentarios.nativeElement.innerHTML += '<br><span class="text-primary">' + response.username +
        //           '</span><br><span>'+ response.mensaje + '</span>';
        this.comentariosUsuario.nativeElement.innerHTML += response.username;
        this.comentariosMensaje.nativeElement.innerHTML += response.mensaje;
      });
    }
  }
}
