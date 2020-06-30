import { Component, OnInit } from '@angular/core';
import { UsuarioService } from './usuario.service';
import {Usuario} from './usuario';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  habilitar : boolean = true;
  habilitar2 : boolean = true;
  usuario : Usuario;
  
  constructor(private usuarioService: UsuarioService) { }

  ngOnInit(): void {

    this.usuarioService.getUsuario().subscribe( usuario => this.usuario = usuario);
  }

}
