import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { ExpressService } from 'src/app/services/express.service';

import {
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed,
  Capacitor,
} from '@capacitor/core';

const { PushNotifications } = Plugins;

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {

  public selectedIndex = 0;
  subscribe:any;
  user:any={};
  notifi:boolean=false;
  cont:string;
  
  constructor(private platform:Platform, 
              private express:ExpressService,
              private router: Router,
              ) {
    this.subscribe = this.platform.backButton.subscribeWithPriority( 666666, () =>{
      if(this.constructor.name ==  'FolderPage'){
        navigator['app'].exitApp();
      }
    });
   }

  ngOnInit() {
    this.user = this.express.getStorage('user');

    this.express.getCountNotificacion(this.user.id)
                .subscribe( result =>{
                  if(result>0){
                    this.notifi=true;
                    this.cont=result;
                  }
                },err=>{

                });

    if(Capacitor.platform !== 'web'){
      this.registerPush();
    }
  }

  registerPush(){
    PushNotifications.requestPermission().then( result => {
      if (result.granted) {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        // Show some error
      }
    });

    PushNotifications.addListener(
      'registration',
      (token: PushNotificationToken) => {
        this.express.getTokenFirebase(this.user.id, token.value)
                    .subscribe( result =>{}, err=>{} );
      },
    );

    // PushNotifications.addListener(
    //   'pushNotificationReceived',
    //   (notification: PushNotification) => {
    //     // alert('Push received: ' + JSON.stringify(notification));
    //   },
    // );

    // PushNotifications.addListener(
    //   'pushNotificationActionPerformed',
    //   (notification: PushNotificationActionPerformed) => {
    //     // alert('Push action performed: ' + JSON.stringify(notification));
    //   },
    // );

  }

  salir(){
    localStorage.removeItem('user');
    this.router.navigateByUrl('login');
  }

}
