import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { ItemsBestBeforeComponent } from './items-best-before-component';

@NgModule({
  declarations: [
    ItemsBestBeforeComponent,
  ],
  imports: [
    IonicPageModule.forChild(ItemsBestBeforeComponent),
    TranslateModule.forChild()
  ],
  exports: [
    ItemsBestBeforeComponent
  ]
})
export class ItemsBestBeforeComponentModule {}
