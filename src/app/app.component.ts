import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnInit{
 
  constructor(private _router : Router ) { }

  ngOnInit(): void {
    
    this._router.routeReuseStrategy.shouldReuseRoute = function(){
      return false;
    };

    this._router.events.subscribe((evt) => {
          if (evt instanceof NavigationEnd) {
              this._router.navigated = false;
              window.scrollTo(0, 0);
          }
    });
  }

  public cosas : any[] = ['casa','perro'];
  
  public habilitar:boolean = true;

  title = 'socialweb-app';
}
