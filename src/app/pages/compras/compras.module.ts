import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ComprasPageRoutingModule } from './compras-routing.module';

import { ComprasPage } from './compras.page';
import { ModalPage } from '../modal/modal.page';
import { ModalPageModule } from '../modal/modal.module';

@NgModule({
  entryComponents:[
    ModalPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComprasPageRoutingModule,
    ModalPageModule
  ],
  declarations: [ComprasPage]
})
export class ComprasPageModule {}
