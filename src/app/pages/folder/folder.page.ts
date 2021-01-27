import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { ExpressService } from 'src/app/services/express.service';

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
              private router: Router) {
    this.subscribe = this.platform.backButton.subscribeWithPriority( 666666, () =>{
      if(this.constructor.name ==  'FolderPage'){
        navigator['app'].exitApp();
      }
    });
   }

  ngOnInit() {
    this.user = this.express.getStorage('user');
  }

  salir(){
    localStorage.removeItem('user');
    this.router.navigateByUrl('login');
  }

}
