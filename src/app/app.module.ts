import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { FormsModule } from '@angular/forms'

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { UsuariosComponent } from './usuarios/usuarios.component';

import { UsuarioService } from './usuarios/usuario.service';
import { PublicacionesComponent } from './publicaciones/publicaciones.component';
import { PublicacionFormComponent } from './publicaciones/publicacionForm.component';
import { registerLocaleData} from '@angular/common';

// importar locales
import localePy from '@angular/common/locales/es-PY';
import localePt from '@angular/common/locales/pt';
import localeEn from '@angular/common/locales/en';
import localeEsAr from '@angular/common/locales/es-AR';
import localeEs from '@angular/common/locales/es';
import { PaginatorComponent } from './paginator/paginator.component';
import { LoginComponent } from './usuarios/login.component';
import { TokenInterceptor } from './publicaciones/interceptors/tokenInterceptor';
import { AuthInterceptor } from './publicaciones/interceptors/authInterceptor';

        
registerLocaleData(localeEs, 'es');

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    UsuariosComponent,
    PublicacionesComponent,
    PublicacionFormComponent,
    PaginatorComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [UsuarioService,  
              { provide: LOCALE_ID, useValue: 'es' }, 
              { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
              { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true } ],             
  bootstrap: [AppComponent]
})
export class AppModule { }
