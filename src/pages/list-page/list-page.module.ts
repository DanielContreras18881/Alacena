import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { ListPage } from './list-page';

@NgModule({
  declarations: [
    ListPage,
  ],
  imports: [
    IonicPageModule.forChild(ListPage),
    TranslateModule.forChild()
  ],
  exports: [
    ListPage
  ]
})
export class ListPageModule {}
