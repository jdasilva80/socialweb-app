import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'nav-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.css']
})
export class PaginatorComponent implements OnInit {

  @Input() paginadorHijo : any;

  public paginas : number[];

  constructor() { }

  ngOnInit(): void {

    this.paginas = new Array(this.paginadorHijo.totalPages).fill(0).map(

      (_valor, indice) =>  indice  + 1
    )
  }
  
  decrementar(){

    this.paginas = new Array(this.paginadorHijo.totalPages -1 ).fill(0).map(

      (_valor, indice) =>  indice  + 1
    )
  }

}
