import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { ModalPage } from '../modal/modal.page';

@Component({
  selector: 'app-mandados',
  templateUrl: './mandados.page.html',
  styleUrls: ['./mandados.page.scss'],
})
export class MandadosPage implements OnInit {

  direccion:string="<- busca tu direccion";
  destino:string="<- busca tu direccion del destino";

  constructor(private modalController: ModalController,
              private alertController: AlertController) {}

  ngOnInit() {
  }

  async inicio() {
    const modal = await this.modalController.create({
      component: ModalPage,
      cssClass: 'my-custom-class',
      componentProps: {
        'registro': false
      }
    });
     await modal.present();
     const {data}  =  await modal.onDidDismiss();
    
    if(data.direccion){
       this.direccion = String(data.direccion);
    }
    
  }

  async final() {
    const modal = await this.modalController.create({
      component: ModalPage,
      cssClass: 'my-custom-class',
      componentProps: {
        'registro': false
      }
    });
     await modal.present();
     const {data}  =  await modal.onDidDismiss();
    
    if(data.direccion){
       this.destino = String(data.direccion);
    }
    
  }

  async guardar(){
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Mandado solicitado',
      message: 'Un integrante de nuestro equipo atendera su mandado, posible mente se contacte con usted.',
      buttons: ['OK']
    });

    await alert.present();
  }

}
