import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import { EmailComposer } from '@ionic-native/email-composer';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { AlertController, Platform } from '@ionic/angular';
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
  email:string;
  loadin:boolean=false;


  constructor(
    public alertController: AlertController,
    private router: Router,
    private express: ExpressService,
    private platform:Platform ) {

      this.subscribe = this.platform.backButton.subscribeWithPriority( 666666, () =>{
        if(this.constructor.name ==  'LoginPage'){
          navigator['app'].exitApp();
        }
      });
     }

  ngOnInit() {
  }


  send(){

    this.express.getEmail( this.email, this.generaNss() )
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
    this.express.getLogin( this.codigo )
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
