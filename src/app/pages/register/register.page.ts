import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
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
  spinner:boolean=false;
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
              private express:ExpressService,
              private toastController: ToastController ) {
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

  async send(){
    this.spinner=true;
    this.users.token = this.generaNss();
    this.users.phone = String(this.users.phone)
    if( this.users.phone !== '' && this.users.email !== '' && this.users.name !== '' && this.users.surname !== ''
    && this.users.location !== '' && this.users.email !== ''){
      this.express.getNewUSer(this.users)
      .subscribe( async result => {
        

        if(result['message']){
          
          this.getEnviar();
        }else{
        
          this.spinner=false;
          const toast = await this.toastController.create({
            message: 'Email ya ha sido registrado',
            position:"top",
            animated:true,
            color:'danger',
            duration: 2500
          });
          toast.present();
        }
      } );
    }else{
      this.spinner=false;
      const toast = await this.toastController.create({
        message: 'LLenar todos los campos por favor',
        position:"top",
        animated:true,
        color:'danger',
        duration: 2000
      });
      toast.present();
    }

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
                    this.spinner=false;
                    this.envio = true;

                  }
                } );

  }

  login(){
    this.loadin=true;
    this.expres.getLogin( this.codigo )
    .subscribe( async result => {
      if(result.login){
        await this.express.saveStorage('user', result.user);
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
