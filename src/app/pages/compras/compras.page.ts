import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { Market } from 'src/app/models/marketModels';
import { ExpressService } from 'src/app/services/express.service';
import { ModalPage } from '../modal/modal.page';

@Component({
  selector: 'app-compras',
  templateUrl: './compras.page.html',
  styleUrls: ['./compras.page.scss'],
})
export class ComprasPage implements OnInit {

  loadin:boolean=false;
  list:Market={
    id:0,
    name_market:'',
    list:'',
    payment:'',
    direction:"<- busca tu direccion",
    location:'',
    status:'Pendiente',
    id_user:0
  }

  constructor(private modalController: ModalController,
              private alertController: AlertController,
              private express:ExpressService,
              private toastController: ToastController,
              private router: Router) { }

  ngOnInit() {
  }

  async entrega() {
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
       this.list.direction = data.direccion;
       this.list.location = data.coordenadas;
    }
    
  }


  async guardar(){
    this.loadin=true;

    if( this.list.direction != '' && this.list.list != '' && this.list.payment != '' ){
      this.list.id_user = this.express.getStorage('user').id;
      
      this.express.postSaveMarket( this.list )
                  .subscribe( 
                  async result =>{
                    this.loadin=false;

                    const alert = await this.alertController.create({
                      cssClass: 'my-custom-class',
                      header: 'Compra Solicitada',
                      message: 'Un integrante de nuestro equipo atendera su mandado, posible mente se contacte con usted.',
                      buttons: ['OK']
                    });
                
                    await alert.present();

                    this.list={
                      id:0,
                      name_market:'',
                      list:'',
                      payment:'',
                      direction:"<- busca tu direccion",
                      location:'',
                      status:'Pendiente',
                      id_user:0
                    }


                    this.router.navigate(['inicio'])
                  }, 
                  async err =>{
                    this.loadin=false;
                    const toast = await this.toastController.create({
                      message: 'Lo sentimos ha ocurrido un error',
                      position:"top",
                      animated:true,
                      color:'danger',
                      duration: 2000
                    });
                    toast.present();
                  } 
                  );
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
