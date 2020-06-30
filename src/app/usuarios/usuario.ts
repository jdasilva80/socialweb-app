import { Contacto } from './contacto';

export class Usuario {

    id:number;
    nombre:string;
    apellidos:string;
    username:string;
    email:string;
    fechaNacimiento:string;
    fechaAlta:string;
    activo:boolean;
    intentos:number;
    foto:string;
    password:string;
    contactos:Contacto[];
    roles:string[];
}
