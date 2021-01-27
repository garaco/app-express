import { Component, OnInit } from '@angular/core';
import { ExpressService } from 'src/app/services/express.service';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
})
export class HistorialPage implements OnInit {

  lists:any[];
  load:boolean=false;

  constructor(private express:ExpressService) {
    this.load=true;
    const id = this.express.getStorage('user').id;
    this.express.getlistAll(id)
                .subscribe( result => {
                  this.lists = result.data;
                  this.load=false;
                },
                err =>{
                  console.log(err);
                  this.load=false;
                } );
   }

  ngOnInit() {
  }

}
