import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { map } from "rxjs/operators";
import { User } from '../models/userModels';

@Injectable({
  providedIn: 'root'
})
export class ExpressService {

  API_URI:string = environment.api_uri;
  

  constructor(private http: HttpClient) {}

  location(lat, lng){
    return this.http.get(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`);
  }

  saveStorage(clave:string, datos:any[]){
    localStorage.setItem(clave, JSON.stringify(datos));
 }

 getStorage(clave:string){
   if(localStorage.getItem(clave)){
    return JSON.parse(localStorage.getItem(clave));
   }
 }

  getNewUSer( users: User){
    return this.http.post(`${this.API_URI}/user/newUser`, users);

  }

  getEmail(email:string, token:string){

    return this.http.get(`${this.API_URI}/user/sendEmail/${email}/${token}`)
                    .pipe( map( result => result['row']['data'] ));
  }

  getLogin( token:string ){
    return this.http.get(`${this.API_URI}/user/login/${token}`)
                    .pipe( map( result => result['row']['data'] ));
  }

  getToken( token:string, email:string ){
    return this.http.get(`${this.API_URI}/user/generate/${token}/${email}`)
                    .pipe( map( result => result['row']['data'] ));
  }

}
