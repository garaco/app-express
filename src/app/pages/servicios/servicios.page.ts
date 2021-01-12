import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.page.html',
  styleUrls: ['./servicios.page.scss'],
})
export class ServiciosPage implements OnInit {

  constructor(private alertController: AlertController) { }

  ngOnInit() {
  }

  async guardar(){
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Mandado solicitado',
      message: 'Un integrante de nuestro equipo atendera su mandado, posible mente se contacte con usted.',
      buttons: ['OK']
    });

    await alert.present();
  }

}
