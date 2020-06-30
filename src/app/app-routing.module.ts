import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { PublicacionFormComponent } from './publicaciones/publicacionForm.component';
import { PublicacionesComponent } from './publicaciones/publicaciones.component';
import { LoginComponent } from './usuarios/login.component';
import { AuthGuard } from './usuarios/guards/auth.guard';
import { RoleGuard } from './usuarios/guards/role.guard';


const routes: Routes = [
  {path:'', redirectTo: '/publicaciones', pathMatch:'full'},  
  {path:'usuarios', component: UsuariosComponent},
  {path:'publicaciones', component: PublicacionesComponent, canActivate : [RoleGuard], data: { role : 'ROLE_USER'}},
  {path:'publicaciones/page/:page', component: PublicacionesComponent, canActivate : [RoleGuard], data: { role : 'ROLE_USER'}},
  {path:'publicacion/form', component: PublicacionFormComponent, canActivate : [AuthGuard]},
  {path:'publicacion/form/:id', component: PublicacionFormComponent, canActivate : [AuthGuard]},
  {path:'login', component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
