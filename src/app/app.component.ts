import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  public cosas : any[] = ['casa','perro'];
  
  public habilitar:boolean = true;

  title = 'socialweb-app';
}
