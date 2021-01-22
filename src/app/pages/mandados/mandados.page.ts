import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { Order } from 'src/app/models/orderModels';
import { ExpressService } from 'src/app/services/express.service';
import { ModalPage } from '../modal/modal.page';

@Component({
  selector: 'app-mandados',
  templateUrl: './mandados.page.html',
  styleUrls: ['./mandados.page.scss'],
})
export class MandadosPage implements OnInit {

  orden:Order={
    id: 0,
    direction_init:'<- busca tu direccion',
    comment_init: '',
    location_init:'',
    direction_final:'<- busca tu direccion del destino',
    comment_final: '',
    location_final: '',
    status: 'Pendiente',
    payment: '',
    create_at: new Date(),
    id_user:0
  }

  loadin:boolean=false;

  constructor(private modalController: ModalController,
              private alertController: AlertController,
              private toastController: ToastController,
              private express: ExpressService,
              private router: Router) {
              }

  ngOnInit() {
  }

  async inicio() {
    const modal = await this.modalController.create({
      component: ModalPage,
      cssClass: 'my-custom-class',
      componentProps: {
        'registro': false,
        'location':false
      }
    });
     await modal.present();
     const {data}  =  await modal.onDidDismiss();
    
    if(data.direccion){
       this.orden.direction_init = String(data.direccion);
       this.orden.location_init=String(data.coordenadas);
    }
    
  }

  async final() {
    const modal = await this.modalController.create({
      component: ModalPage,
      cssClass: 'my-custom-class',
      componentProps: {
        'registro': false,
        'location':false
      }
    });
     await modal.present();
     const {data}  =  await modal.onDidDismiss();
    
    if(data.direccion){
       this.orden.direction_final = String(data.direccion);
       this.orden.location_final=String(data.coordenadas);
    }
    
  }

  async guardar(){

    this.loadin=true;
    this.orden.id_user = this.express.getStorage('user').id;

    if(this.orden.direction_init !='<- busca tu direccion' && this.orden.direction_final !='<- busca tu direccion del destino' 
      && this.orden.comment_init !='' && this.orden.comment_final !='' && this.orden.payment !='' ){
        
        this.express.postSaveOrde(this.orden)
                    .subscribe( async result =>{
                      
                      this.loadin=false;
                      const alert = await this.alertController.create({
                        cssClass: 'my-custom-class',
                        header: 'Mandado solicitado',
                        message: 'Un integrante de nuestro equipo atendera su mandado, posible mente se contacte con usted.',
                        buttons: ['OK']
                      });
                  
                      await alert.present();

                      this.orden={
                        id: 0,
                        direction_init:'<- busca tu direccion',
                        comment_init: '',
                        location_init:'',
                        direction_final:'<- busca tu direccion del destino',
                        comment_final: '',
                        location_final: '',
                        status: 'Pendiente',
                        payment: '',
                        create_at: new Date(),
                        id_user:0
                      }

                      this.router.navigate(['inicio'])

                    }, async err =>{
                      
                      this.loadin=false;
                      const toast = await this.toastController.create({
                        message: 'Lo sentimos ha ocurrido un error',
                        position:"top",
                        animated:true,
                        color:'danger',
                        duration: 2000
                      });
                      toast.present();
                      
                    } );
        
    }else{
      this.loadin=false;
      const toast = await this.toastController.create({
        message: 'LLenar todos los campos por favor',
        position:"top",
        animated:true,
        color:'danger',
        duration: 2000
      });
      toast.present();
    }
    

  }

}
