import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { ExpressService } from 'src/app/services/express.service';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {

  subscribe:any;
  user:any={};
  
  constructor(private platform:Platform, private express:ExpressService) {
    this.subscribe = this.platform.backButton.subscribeWithPriority( 666666, () =>{
      if(this.constructor.name ==  'FolderPage'){
        navigator['app'].exitApp();
      }
    });
   }

  ngOnInit() {
    this.user = this.express.getStorage('user');
    
  }

}
