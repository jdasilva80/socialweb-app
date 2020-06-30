import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  constructor() { }

  private isNoAutorizado(e): boolean {
    
    if (e.status == 401) {

      return true;
    }

    if (e.status == 403) {
   
      return true;
    }
    return false;
  }

}
