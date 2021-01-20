import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import { EmailComposer } from '@ionic-native/email-composer';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { AlertController, Platform, ToastController } from '@ionic/angular';
import { ExpressService } from 'src/app/services/express.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  envio:boolean = false;
  subscribe:any;
  codigo:string;
  email:string='';
  loadin:boolean=false;
  spinner:boolean=false;

  constructor(
    public alertController: AlertController,
    private router: Router,
    private express: ExpressService,
    private platform:Platform,
    private toastController: ToastController ) {

      this.subscribe = this.platform.backButton.subscribeWithPriority( 666666, () =>{
        if(this.constructor.name ==  'LoginPage'){
          navigator['app'].exitApp();
        }
      });
     }

  ngOnInit() {
  }



  async send(){
    this.spinner=true;
    const token = this.generaNss();

     if(this.email !=='' ){
      
      this.getEnviar(this.email, token);
     }else{
      this.spinner=false;
      const toast = await this.toastController.create({
        message: 'Ingresar email por favor.',
        position:"top",
        animated:true,
        color:'danger',
        duration: 2000
      });
      toast.present();
     }


  }

  getEnviar( email:string, token:string ){
    
    this.express.getToken(token, email)
                .subscribe( async result =>{
                  
                  if(result.message === 'email enviado'){
                    this.loadin=true;
                    const alert = await this.alertController.create({
                      cssClass: 'my-custom-class',
                      subHeader:'Se ha enviado un codigo al email registrado',
                      message: '',
                      buttons: ['OK']
                    });
                    this.loadin=false;
                    await alert.present();
                
                    this.envio = true;

                  }else{
                    this.loadin=false;
                    const toast = await this.toastController.create({
                      message: result.message,
                      position:"top",
                      animated:true,
                      color:'danger',
                      duration: 2000
                    });
                    toast.present();
                  }
                } );

  }

  login(){
    this.loadin=true;
    this.express.getLogin( this.codigo )
    .subscribe(async result => {
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
