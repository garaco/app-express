import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { ExpressService } from 'src/app/services/express.service';

import { FirebaseX } from '@ionic-native/firebase-x/ngx';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {

  public selectedIndex = 0;
  subscribe:any;
  user:any={};
  
  constructor(private platform:Platform, 
              private express:ExpressService,
              private router: Router,
              private firebaseX: FirebaseX) {
    this.subscribe = this.platform.backButton.subscribeWithPriority( 666666, () =>{
      if(this.constructor.name ==  'FolderPage'){
        navigator['app'].exitApp();
      }
    });
   }

  ngOnInit() {
    this.user = this.express.getStorage('user');
          // get FCM token
          this.firebaseX.getToken()
          .then(token => console.log(`The token is ${token}`)) // save the token server-side and use it to push notifications to this device
          .catch(error => console.error('Error getting token', error));
  }

  salir(){
    localStorage.removeItem('user');
    this.router.navigateByUrl('login');
  }

}
