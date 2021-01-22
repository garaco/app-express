import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { ModalPage } from '../modal/modal.page';

@Component({
  selector: 'app-compras',
  templateUrl: './compras.page.html',
  styleUrls: ['./compras.page.scss'],
})
export class ComprasPage implements OnInit {

  direccion:string="<- busca tu direccion";

  constructor(private modalController: ModalController,
              private alertController: AlertController) { }

  ngOnInit() {
  }

  async entrega() {
    const modal = await this.modalController.create({
      component: ModalPage,
      cssClass: 'my-custom-class',
      componentProps: {
        'registro': false,
        'location':false
      }
    });
     await modal.present();
     const {data}  =  await modal.onDidDismiss();
    
    if(data.direccion){
       this.direccion = data.direccion;
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
