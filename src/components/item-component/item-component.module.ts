import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ItemComponent } from './item-component';

@NgModule({
  declarations: [
    ItemComponent,
  ],
  imports: [
    IonicPageModule.forChild(ItemComponent),
  ],
  exports: [
    ItemComponent
  ]
})
export class ItemComponentModule {}
