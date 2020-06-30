import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { Publicacion } from './publicacion';
import { PublicacionService } from './publicacion.service';
import { ModalService} from './modal.service'
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2'
import { AuthService } from '../usuarios/auth.service';

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
            
            (response) => {
                this.publicacion = response;
            }
          )
        }
      }
    )
  }
  
 // crear() : void{

  //  this.publicacionService.create(this.publicacion, 1).subscribe( 

    //  (response) => {

      //  this.router.navigate(['/publicaciones']);
      //  swal.fire('Nueva publicación', `se ha creado la publicación : ${response.publicacion.id}`, 'success');
      // })
  //}

  crearConFoto() : void{

    if(!this.foto){

      swal.fire('Error', `debe seleccionar una imagen`, 'error');

    }else{

      this.publicacionService.crearConFoto(this.publicacion, 1, this.foto).subscribe( 

      (response) => {
        
        this.modalService.notificarUpload.emit(response.publicacion);       
        swal.fire('Nueva publicación', `se ha creado la publicación : ${response.publicacion.id}`, 'success');
        this.cerrarModal();
        this.router.navigate(['/publicaciones/page/', 0]);
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

          (response) => {

            this.modalService.notificarUpload.emit(response.publicacion);
            swal.fire('Publicación actualizada', `se ha actualizado la publicación : ${response.publicacion.id}`, 'success');
            this.cerrarModal();            
            this.router.navigate(['/publicaciones/page/',this.paginaInjectada]);
          },
            e =>{
              this.errores = e.error.errores as string[];
            }
          )
        }
    }

  cerrarModal(){

    this.publicacion.mensaje = this.oldMensaje;
    this.modalService.cerrarModal();
    this.foto = null;
  }
}  