import { Component, OnInit } from '@angular/core';
import { PublicacionService } from './publicacion.service';
import { ModalService} from './modal.service'
import { Publicacion } from './publicacion';
import { Router, ActivatedRoute} from '@angular/router';
import  swal from 'sweetalert2';
import { AuthService } from '../usuarios/auth.service';

@Component({
  selector: 'app-publicaciones',
  templateUrl: './publicaciones.component.html',
  styleUrls: ['./publicaciones.component.css']
})
export class PublicacionesComponent implements OnInit {

  publicaciones : Publicacion[];  
  paginador : any;
  publicacionSeleccionada : Publicacion;
  pagina : number;
  
  constructor(private publicacionService: PublicacionService, private router : Router,
              private activatedRoute : ActivatedRoute, private modalService : ModalService,
              public authService: AuthService) { }

  ngOnInit(): void {

    this.activatedRoute.paramMap.subscribe( 
      
      (params) => {

        let page:number = +params.get('page');// para transformarlo a number
        
        if(!page){
          page = 0;
        }
        this.pagina = page;
        
        this.publicacionService.getPublicacionesUsuarioPaginado(page).subscribe( response => {

          this.publicaciones = response.content as Publicacion[];
          this.paginador = response;
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
      text: "será irreversible!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, borralo!'

    }).then((result) => {

      this.publicacionService.delete(publicacionId).subscribe( 

        (response) => {
                    
          this.publicaciones= this.publicaciones.filter( (p) => p.id != publicacionId );
          swal.fire('atención', `publicacion eliminada con id ${publicacionId}`, 'success');          
          this.router.navigate(['/publicaciones/page/', this.pagina>0 ? this.pagina-1 : 0]);
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
}
