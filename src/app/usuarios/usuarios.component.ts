import { Component, OnInit } from '@angular/core';
import { UsuarioService } from './usuario.service';
import {Usuario} from './usuario';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  habilitar : boolean = true;
  habilitar2 : boolean = true;
  usuario : Usuario;
  cargando : boolean = true;
  
  constructor(private usuarioService: UsuarioService) { }

  ngOnInit(): void {

    this.usuarioService.getUsuario().subscribe( event => {
        
      if(event.type === HttpEventType.Response){
  
          this.cargando = false;
          this.usuario = event.body as Usuario;
        }
      });
  }
}
