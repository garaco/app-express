import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { AlertController, ModalController } from '@ionic/angular';
import { ModalPage } from '../pages/modal/modal.page';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  regiter:boolean=false;
  direccion:string='<- busca tu direccion';
  envio:boolean=false;

  constructor(public modalController:ModalController,
              private emailComposer:EmailComposer,
              private router:Router,
              public alertController:AlertController ) {
    this.regiter=true;
   }

  ngOnInit() {
  }

  async direction() {
    const modal = await this.modalController.create({
      component: ModalPage,
      cssClass: 'my-custom-class',
      componentProps: {
        'registro': true
      }
    });
     await modal.present();
     const {data}  =  await modal.onDidDismiss();
    
    if(data.direccion){
       this.direccion = String(data.direccion);
    }
    
  }

  async send(){
    const cadena = this.generaNss();

    console.log(cadena);
    


     const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Registrado correctamente',
      subHeader:'Se ha enviado un codigo al email registrado',
      message: '',
      buttons: ['OK']
    });

    await alert.present();

    this.envio = true;
  }

  login(){
    this.router.navigateByUrl('inicio');
  }

  generaNss() {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < 10; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  }

}
