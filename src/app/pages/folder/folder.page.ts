import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { ExpressService } from 'src/app/services/express.service';
import { FCM } from '@ionic-native/fcm/ngx';

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
              private fcm: FCM) {
    this.subscribe = this.platform.backButton.subscribeWithPriority( 666666, () =>{
      if(this.constructor.name ==  'FolderPage'){
        navigator['app'].exitApp();
      }
    });
   }

  ngOnInit() {
    this.user = this.express.getStorage('user');
    this.fcm.getToken().then(token => {
      console.log(token);
    });
  }

  salir(){
    localStorage.removeItem('user');
    this.router.navigateByUrl('login');
  }

}
