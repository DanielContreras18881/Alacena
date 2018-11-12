import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { ListsPage } from './lists-page';

@NgModule({
  declarations: [
    ListsPage,
  ],
  imports: [
    IonicPageModule.forChild(ListsPage),
    TranslateModule.forChild()
  ],
  exports: [
    ListsPage
  ]
})
export class ListsPageModule {}
