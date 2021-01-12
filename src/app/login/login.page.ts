import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import { EmailComposer } from '@ionic-native/email-composer';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { AlertController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  envio:boolean = false;
  subscribe:any;


  constructor(private emailComposer: EmailComposer,
    public alertController: AlertController,
    private router: Router,
    private platform:Platform ) {
      this.subscribe = this.platform.backButton.subscribeWithPriority( 666666, () =>{
        if(this.constructor.name ==  'LoginPage'){
          navigator['app'].exitApp();
        }
      });
     }

  ngOnInit() {
  }

  async send(){
    const cadena = this.generaNss();
    let email = {
      to: 'ale17garaco@gmail.com',
      cc: '',
      bcc: [],
      attachments: [],
      subject: 'Codigo de ingreso',
      body: cadena,
      isHtml: false
    }
    console.log(cadena);
    
     this.emailComposer.open(email);

     const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Se ha enviado un codigo al email ingresado',
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
