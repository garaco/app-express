import { Component, OnInit } from '@angular/core';
import { ExpressService } from 'src/app/services/express.service';

@Component({
  selector: 'app-notificacion',
  templateUrl: './notificacion.page.html',
  styleUrls: ['./notificacion.page.scss'],
})
export class NotificacionPage implements OnInit {

  list:any[]=[];
  load:boolean=false;
  constructor(private express:ExpressService
    ) { }

  ngOnInit() {
    this.load=true;
    const user = this.express.getStorage('user').id;
    this.express.getNotificacion(user)
                .subscribe( result => {
                  this.list = result;
                  this.load=false;
                  this.leidos();
                }, err =>{
                  this.load=false;
                });
  }

  leidos(){
    const user = this.express.getStorage('user').id;
    this.express.getLeidosNotificacion(user)
                .subscribe( result => {}, err =>{});
  }

}
