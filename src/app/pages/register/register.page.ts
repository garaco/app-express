import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { AlertController, ModalController } from '@ionic/angular';
import { User } from 'src/app/models/userModels';
import { ExpressService } from 'src/app/services/express.service';
import { ModalPage } from '../modal/modal.page';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  regiter:boolean=false;
  envio:boolean=false;
  codigo:string;
  loadin:boolean=false;
  users:User ={
    id: 0,
    phone: '',
    email: '',
    name:'',
    surname: '',
    direction: '<- busca tu direccion',
    location:'',
    token:'',
    create_at:new Date()
}

  constructor(public modalController:ModalController,
              private expres: ExpressService,
              private router:Router,
              public alertController:AlertController,
              private express:ExpressService ) {
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
      this.users.direction = String(data.direccion);
       this.users.location=String(data.coordenadas);
    }
    
  }

  send(){
    this.users.token = this.generaNss();
    this.users.phone = String(this.users.phone)
    
     this.express.getNewUSer(this.users)
        .subscribe( result => {
          
          if(result['message']){

            this.getEnviar();
          }
        } )


  }

  getEnviar(){

    this.express.getEmail( this.users.email, this.users.token )
                .subscribe( async result =>{
                  
                  if(result.message === 'email enviado'){

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
                } );

  }

  login(){
    this.loadin=true;
    this.expres.getLogin( this.codigo )
    .subscribe( result => {
      if(result.login){
        this.loadin=false;
        this.router.navigateByUrl('inicio');
      }
    } );
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
