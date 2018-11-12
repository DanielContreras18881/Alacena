import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { CategorysPage } from './categorys-page';

@NgModule({
  declarations: [
    CategorysPage,
  ],
  imports: [
    IonicPageModule.forChild(CategorysPage),
    TranslateModule.forChild()
  ],
  exports: [
    CategorysPage
  ]
})
export class CategorysPageModule {}
