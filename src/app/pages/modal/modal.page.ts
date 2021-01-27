import { Component, Input, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
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

  datos:string=''; 
  gl:string='';
  direccion:string='';
  map:Leaflet.Map;
  vermapa:boolean=false;
  title:string = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  lat:any;
  lng:any;
  marker:Leaflet.marker;
  user:any;
  lists:any[];
  load:boolean=false;

  
  constructor(private modal: ModalController,
            private express:ExpressService,
            private toastController: ToastController) { 
    
  }

  ngOnInit() {
    
    if(this.registro){
      this.vermapa=true;
      setTimeout(() => {
        this.getmapa();
      }, 1000);
    }else{
      this.load=true;
      this.user = this.express.getStorage('user');
      this.express.getDiection( this.user.id )
                  .subscribe( result =>{     
                    this.load=false;             
                    this.lists = result.data;
                    
                  }, 
                  async err =>{
                    this.load=false;
                    const toast = await this.toastController.create({
                      message: 'Lo sentimos ha ocurrido un error',
                      position:"top",
                      animated:true,
                      color:'danger',
                      duration: 2000
                    });
                    toast.present();
                  });
    }
    
  }

  getmapa(){
    this.vermapa=true;
    const mapa = new Leaflet.Map('map');
    
    new Leaflet.tileLayer(this.title, {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapa);

    if(!this.location){
      this.map = mapa.setView([18.448255704152956, -95.21236202278033], 18);

      this.map.locate({enableHighAccuracy:true });
        
      this.map.on('locationfound', e =>{
        this.gl = `${e.latlng.lat} , ${e.latlng.lng}`;
        this.lat=e.latlng.lat;
        this.lng=e.latlng.lng;
        this.map = mapa.setView([e.latlng.lat, e.latlng.lng], 18);
        this.market(e.latlng.lat , e.latlng.lng);
      });

      this.map.on('locationerror', e => {
        this.lat="18.448255704152956";
        this.lng="-95.21236202278033";
        this.market(18.448255704152956, -95.21236202278033);
      });
      

    }else{
      let latLng = this.location.split(',');
      let lat = Number(latLng[0]);
      let lng = Number(latLng[1]);
    
      this.map = mapa.setView([lat, lng], 18);

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

  save(direction:string,gl:string ){
    this.modal.dismiss({
      direccion:direction,
      coordenadas:gl
    });
  }

}
