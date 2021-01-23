import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { Service } from 'src/app/models/ServicesModels';
import { ExpressService } from 'src/app/services/express.service';

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.page.html',
  styleUrls: ['./servicios.page.scss'],
})
export class ServiciosPage implements OnInit {

  list:Service={
    id:0,
    services:'',
    comment:'',
    payment:'',
    status:'Pendiente',
    id_user:0
  }
  loadin:boolean=false;

  constructor(private modalController: ModalController,
    private alertController: AlertController,
    private toastController: ToastController,
    private express: ExpressService,
    private router: Router) { }

  ngOnInit() {
  }

  async guardar(){
    this.loadin=true;

    if(this.list.services != '' && this.list.comment != '' && this.list.payment != ''){

      this.list.id_user = this.express.getStorage('user').id;
      
      this.express.postSaveService( this.list )
                  .subscribe( async result => {

                    this.loadin=false;
                    const alert = await this.alertController.create({
                      cssClass: 'my-custom-class',
                      header: 'Mandado solicitado',
                      message: 'Un integrante de nuestro equipo atendera su mandado, posible mente se contacte con usted.',
                      buttons: ['OK']
                    });
                
                    await alert.present();

                    this.list={
                      id:0,
                      services:'',
                      comment:'',
                      payment:'',
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
