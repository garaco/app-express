import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { User } from 'src/app/models/userModels';
import { ExpressService } from 'src/app/services/express.service';
import { ModalPage } from '../modal/modal.page';

@Component({
  selector: 'app-mis-datos',
  templateUrl: './mis-datos.page.html',
  styleUrls: ['./mis-datos.page.scss'],
})
export class MisDatosPage implements OnInit {

  users:User;
  loadin:boolean=false;

  constructor(private expres:ExpressService,
    private modalController:ModalController,
    private toastController: ToastController) {
    this.users = this.expres.getStorage('user');
   }

  ngOnInit() {
  }

  async direction() {
    const modal = await this.modalController.create({
      component: ModalPage,
      cssClass: 'my-custom-class',
      componentProps: {
        'registro': true,
        'location':this.users.location
      }
    });
     await modal.present();
     const {data}  =  await modal.onDidDismiss();
    
    if(data.direccion){
      this.users.direction = String(data.direccion);
       this.users.location=String(data.coordenadas);  
    }
    
  }

  save(){
    this.loadin=true;

    this.expres.postEditUser(this.users)
                .subscribe( async result =>{
                  this.loadin=false;
                  await this.expres.saveStorage('user', result.user);
                  
                  const toast = await this.toastController.create({
                    message: 'Guardado Correctamente',
                    position:"middle",
                    animated:true,
                    color:'primary',
                    duration: 2500
                  });
                  toast.present();

                }, async err =>{
                      
                  const toast = await this.toastController.create({
                    message: 'Lo sentimos ha ocurrido un error',
                    position:"top",
                    animated:true,
                    color:'danger',
                    duration: 2000
                  });
                  toast.present();
                  
                });
    
    
  }

}
