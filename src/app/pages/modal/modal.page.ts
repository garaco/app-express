import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import * as Leaflet from 'leaflet';
import { ExpressService } from 'src/app/services/express.service';

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
  map:Leaflet.Map;
  vermapa:boolean=false;
  title:string = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  lat:any;
  lng:any;
  marker:Leaflet.marker;

  
  constructor(private modal: ModalController,
            private express:ExpressService) { 
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
    
    this.map = new Leaflet.Map('map').setView([18.4410739, -95.2076404], 18);

    new Leaflet.tileLayer(this.title, {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    this.map.locate({enableHighAccuracy:true })

    this.map.on('locationfound', e =>{
      this.gl = `${e.latlng.lat} , ${e.latlng.lng}`;
      this.market(e.latlng.lat , e.latlng.lng);
      this.lat=e.latlng.lat;
      this.lng=e.latlng.lng;
    });
  
  }

  market(lng: number, lat: number){

    //crear un marcador draggable
     this.marker =  new Leaflet.marker([lng, lat], {draggable:'true'})
                        .addTo(this.map)
                        .bindPopup('Mueveme para seleccionar tu direccion.')
                        .openPopup();
      //cuando se termine de hacer drag, pone la ubicacion en el campo indicado
      this.marker.on("dragend", () => {
        var position = this.marker.getLatLng();
        
        this.lat=position.lat;
        this.lng=position.lng;
      
        });

  }


  salirDatos(){
    
    this.express.location(this.lat, this.lng)
                  .subscribe( result => {
                       this.modal.dismiss({
                        direccion:result['display_name'],
                        coordenadas:this.gl
                      });
                  } );
  }

  salir(){
    this.modal.dismiss();
  }



}
