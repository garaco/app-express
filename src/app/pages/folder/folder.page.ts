import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {

  subscribe:any;
  
  constructor(private platform:Platform) {
    this.subscribe = this.platform.backButton.subscribeWithPriority( 666666, () =>{
      if(this.constructor.name ==  'FolderPage'){
        navigator['app'].exitApp();
      }
    });
   }

  ngOnInit() {
   
  }

}
