import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ItemsBestBeforeComponent } from './items-best-before-component';

@NgModule({
  declarations: [
    ItemsBestBeforeComponent,
  ],
  imports: [
    IonicPageModule.forChild(ItemsBestBeforeComponent),
  ],
  exports: [
    ItemsBestBeforeComponent
  ]
})
export class ItemsBestBeforeComponentModule {}
