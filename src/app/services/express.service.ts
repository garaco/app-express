import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { map } from "rxjs/operators";
import { User } from '../models/userModels';
import { Order } from '../models/orderModels';
import { Market } from '../models/marketModels';
import { Service } from '../models/ServicesModels';
import { Direction } from '../models/directionModel';

@Injectable({
  providedIn: 'root'
})
export class ExpressService {

  API_URI:string = environment.api_uri;

  constructor(private http: HttpClient) {}

  getQuery( params:string ){
    const headers = new HttpHeaders({
      'Accept': 'application/json, text/plain',
      'Content-Type': 'application/json',
      'Authorization': environment.Authorization,
      'AppId':environment.AppId
    });
    return this.http.get(`${this.API_URI}/${params}`, {headers} );
  }

  postQuery( url:string, query:any ){
    const headers = new HttpHeaders({
      'Accept': 'application/json, text/plain',
      'Content-Type': 'application/json',
      'Authorization': environment.Authorization,
      'AppId':environment.AppId
    });
    return this.http.post(`${this.API_URI}/${url}`, JSON.stringify(query), {headers} );
  }

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
    
     return this.postQuery( 'register',users)
                .pipe( map( result => result['row']['data'] ));
    
  }

  getEmail(email:string, token:string){
    return this.getQuery(`sendEmail/${email}/${token}`)
                    .pipe( map( result => result['row']['data'] ));
  }

  getLogin( token:string ){
    return this.getQuery(`login/${token}`)
                    .pipe( map( result => result['row']['data'] ));
  }

  getToken( token:string, email:string ){
    return this.getQuery(`generate/${token}/${email}`)
                    .pipe( map( result => result['row']['data'] ));
  }

  postEditUser(users: User){
    return this.postQuery( 'edit/user',users)
               .pipe( map( result => result['row']['data'] ));
  }

  postSaveOrde(orde: Order){
    return this.postQuery( 'save/orde',orde)
               .pipe( map( result => result['row']['data'] ));
  }

  postSaveMarket( list:Market ){
    return this.postQuery( 'save/market',list)
               .pipe( map( result => result['row']['data'] ));
  }

  postSaveService( list:Service ){
    return this.postQuery( 'save/service',list)
               .pipe( map( result => result['row']['data'] ));
  }

  getlistAll( id:string ){
    return this.getQuery( `list/all/${id}`)
               .pipe( map( result => result['row']));
 }

 getDiection( id:string ){
  return this.getQuery( `direction/${id}`)
             .pipe( map( result => result['row']));
 }

 postSaveDirection( list:Direction ){
  return this.postQuery( 'direction/add',list)
             .pipe( map( result => result['row']['data'] ));
 }

 postDirectionPrincipal( list:any ){
  return this.postQuery( 'edit/user/address',list)
              .pipe( map( result => result['row']['data'] ));
 }

 postEditDirection( list:Direction ){
  return this.postQuery( 'direction/edit',list)
              .pipe( map( result => result['row']['data'] ));
 }

 postDeleteDirection( list:Direction ){
  return this.postQuery( 'direction/delete',list)
              .pipe( map( result => result['row']['data'] ));
 }

}
