import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { ItemsPage } from './items-page';

@NgModule({
  declarations: [
    ItemsPage,
  ],
  imports: [
    IonicPageModule.forChild(ItemsPage),
    TranslateModule.forChild()
  ],
  exports: [
    ItemsPage
  ]
})
export class ItemsPageModule {}
