import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { ItemsNeededComponent } from './items-needed-component';

@NgModule({
  declarations: [
    ItemsNeededComponent,
  ],
  imports: [
    IonicPageModule.forChild(ItemsNeededComponent),
    TranslateModule.forChild()
  ],
  exports: [
    ItemsNeededComponent
  ]
})
export class ItemsNeededComponentModule {}
