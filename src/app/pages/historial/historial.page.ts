import { Component, OnInit } from '@angular/core';
import { ExpressService } from 'src/app/services/express.service';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
})
export class HistorialPage implements OnInit {

  lists:any[];

  constructor(private express:ExpressService) {
    const id = this.express.getStorage('user').id;
    this.express.getlistAll(id)
                .subscribe( result => {
                  this.lists = result.data;
                },
                err =>{
                  console.log(err);
                       
                } );
   }

  ngOnInit() {
  }

}
