import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ItemsNeededComponent } from './items-needed-component';

@NgModule({
  declarations: [
    ItemsNeededComponent,
  ],
  imports: [
    IonicPageModule.forChild(ItemsNeededComponent),
  ],
  exports: [
    ItemsNeededComponent
  ]
})
export class ItemsNeededComponentModule {}
