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
  @Input() location;

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

    if(!this.location){
      this.map = new Leaflet.Map('map').setView([18.4410739, -95.2076404], 18);
    }else{
      let latLng = this.location.split(',');
      let lat = Number(latLng[0]);
      let lng = Number(latLng[1]);
    
      this.map = new Leaflet.Map('map').setView([lat, lng], 18);
    }
    

    new Leaflet.tileLayer(this.title, {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);


    if(!this.location){
      this.map.locate({enableHighAccuracy:true })

      this.map.on('locationfound', e =>{
        this.gl = `${e.latlng.lat} , ${e.latlng.lng}`;
        
        this.market(e.latlng.lat , e.latlng.lng);
        this.lat=e.latlng.lat;
        this.lng=e.latlng.lng;
      });
    }else{

      let latLng = this.location.split(',');
      let lat = Number(latLng[0]);
      let lng = Number(latLng[1]);
      
      this.lat=lat;
      this.lng=lng;

      this.gl = `${lat} , ${lng}`;

      this.market(lat , lng);
    }

  
  }

  market(lat: number, lng: number){

    //crear un marcador draggable
     this.marker =  new Leaflet.marker([lat, lng], {draggable:'true'})
                        .addTo(this.map)
                        .bindPopup('Mueveme para seleccionar tu direccion.')
                        .openPopup();
      //cuando se termine de hacer drag, pone la ubicacion en el campo indicado
      this.marker.on("dragend", () => {
        var position = this.marker.getLatLng();
        
        this.lat=position.lat;
        this.lng=position.lng;

        this.gl = `${position.lat} , ${position.lng}`;

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
