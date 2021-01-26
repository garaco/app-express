import { Component, ViewChild } from '@angular/core';
import { AlertController, IonList, ModalController, ToastController } from '@ionic/angular';
import { Direction } from 'src/app/models/directionModel';
import { ExpressService } from 'src/app/services/express.service';
import { ModalPage } from '../modal/modal.page';

@Component({
  selector: 'app-direcciones',
  templateUrl: './direcciones.page.html',
  styleUrls: ['./direcciones.page.scss'],
})
export class DireccionesPage {
  @ViewChild( IonList ) lista: IonList;
  user:any;
  lists:any[];
  direccion:Direction={
    id:0,
    direction:'',
    location:'',
    id_user:0
  }

  loadin:boolean=false;

  constructor(private express: ExpressService,
              private modalController:ModalController,
              private toastController: ToastController,
              private alertController: AlertController
    ) {
    this.user = this.express.getStorage('user');
    this.express.getDiection( this.user.id )
                .subscribe( result =>{                  
                  this.lists = result.data;
                }, 
                async err =>{
                  
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

   async update( location:string ){
    const modal = await this.modalController.create({
      component: ModalPage,
      cssClass: 'my-custom-class',
      componentProps: {
        'registro': true,
        'location':location
      }
    });
     await modal.present();
     const {data}  =  await modal.onDidDismiss();
    
    if(data.direccion){
      this.loadin=true;
      
      this.user.direction = String(data.direccion);
      this.user.location=String(data.coordenadas);  

      const body = {'id':this.user.id, 'direction': this.user.direction, 'location':this.user.location}
      this.express.postDirectionPrincipal( body )
                  .subscribe( async result =>{
                    this.lista.closeSlidingItems();
                    this.loadin=false;
                    this.express.saveStorage('user', this.user);
                    const toast = await this.toastController.create({
                      message: 'Dirección actualizada',
                      position:"top",
                      animated:true,
                      color:'success',
                      duration: 2000
                    });

                    toast.present();
                  },
                  err=>{
                    this.lista.closeSlidingItems();
                    this.loadin=false;
                  });
    }
   }

   async updateList( list:any ){
     
    const modal = await this.modalController.create({
      component: ModalPage,
      cssClass: 'my-custom-class',
      componentProps: {
        'registro': true,
        'location':list.location
      }
    });
     await modal.present();
     const {data}  =  await modal.onDidDismiss();
    
    if(data.direccion){
      this.loadin=true;
      list.direction = String(data.direccion);
      list.location=String(data.coordenadas);  

      this.express.postEditDirection(list)
                  .subscribe( async result =>{
                    this.lista.closeSlidingItems();
                    this.loadin=false;

                    this.lists = result.direction;
                    const toast = await this.toastController.create({
                      message: 'Dirección actualizada',
                      position:"top",
                      animated:true,
                      color:'success',
                      duration: 2000
                    });

                    toast.present();

                  },
                  err =>{
                    this.lista.closeSlidingItems();
                    this.loadin=false;
                  });
      
    }

   }

   async newDirection(){
    const modal = await this.modalController.create({
      component: ModalPage,
      cssClass: 'my-custom-class',
      componentProps: {
        'registro': true,
        'location':false
      }
    });

    await modal.present();
    const {data}  =  await modal.onDidDismiss();
   
   if(data.direccion){
     this.loadin=true;
     this.direccion.direction = String(data.direccion);
     this.direccion.location  = String(data.coordenadas);  
     this.direccion.id_user   = this.user.id;
    
     this.express.postSaveDirection(this.direccion)
                  .subscribe( async result =>{

                    this.direccion = {
                      id:0,
                      direction:'',
                      location:'',
                      id_user:0
                    }

                    this.lista.closeSlidingItems();
                    this.loadin=false;
                    
                    const toast = await this.toastController.create({
                      message: 'Dirección guardada',
                      position:"top",
                      animated:true,
                      color:'success',
                      duration: 2000
                    });

                    toast.present();
                    this.lists = result.direction;

                  },
                  async err =>{

                    this.lista.closeSlidingItems();
                    this.loadin=false;
                    const toast = await this.toastController.create({
                      message: 'Lo sentimos ha ocurrido un error',
                      position:"top",
                      animated:true,
                      color:'danger',
                      duration: 2000
                    });
                    toast.present();
                  } );
   }

   }

   deleteList( list:any ){
    this.loadin=true;
    this.express.postDeleteDirection(list)
                .subscribe( async result =>{
                  
                  const toast = await this.toastController.create({
                    message: 'Dirección se ha eliminado',
                    position:"top",
                    animated:true,
                    color:'success',
                    duration: 2000
                  });

                  toast.present();
                  this.lista.closeSlidingItems();
                  this.loadin=false;
                  this.lists = result.direction;

                },
                async err =>{
                  this.lista.closeSlidingItems();
                  this.loadin=false;
                  const toast = await this.toastController.create({
                    message: 'Lo sentimos ha ocurrido un error',
                    position:"top",
                    animated:true,
                    color:'danger',
                    duration: 2000
                  });
                  toast.present();
                } );
   }

}
