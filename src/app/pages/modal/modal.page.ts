import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import * as Mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {

  @Input() registro;

  mapboxgl:string = 'pk.eyJ1IjoibGFyc3NvbiIsImEiOiJja2MxbGI1djUwdTdzMnJydTdvYWVnOXBnIn0.rr-85HZZ4gjU-_4QW496hg';
  datos:string=''; 
  gl:string='';
  direccion:string='';
  mapa: Mapboxgl.Map;
  vermapa:boolean=false;

  constructor(private modal: ModalController) { 
    // aqui va a ir el mapa
    
  }

  ngOnInit() {
    
    if(this.registro){
      this.vermapa=true;
      setTimeout(() => {
        this.getmapa();
      }, 1000);
    }
    
  }

  getmapa(){
    this.vermapa=true;
    
    Mapboxgl.accessToken = this.mapboxgl;
    this.mapa = new Mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/larsson/ckjqz2unm31lt19s5ivdsstdz',
    center: [-95.2123416,18.4483123], // starting position
    zoom: 15 // starting zoom
    });
    this.mapa.addControl(new Mapboxgl.NavigationControl());
     this.marcador(-95.2123416,18.4483123);
  }

  marcador(lng: number, lat: number){

    const marker = new Mapboxgl.Marker({
    draggable: true
    })
    .setLngLat([lng, lat])
    .addTo(this.mapa);
    marker.on('drag', ()=> {
       this.gl = marker.getLngLat() ;
       this.datos = String(this.gl);

       var dato  = this.datos.split("(");
       var dat = dato[1].split(")");

       this.gl=dat[0];
      
    });
  }

  salirDatos(){

   fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${this.gl}.json?types=address&access_token=`+this.mapboxgl)
    .then(res => res.json())
    .then(data =>  {      
      this.modal.dismiss({
        direccion:data.features[0].place_name
      });
    } );



  }

  salir(){
    this.modal.dismiss();
  }



}
