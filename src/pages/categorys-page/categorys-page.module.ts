import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CategorysPage } from './categorys-page';

@NgModule({
  declarations: [
    CategorysPage,
  ],
  imports: [
    IonicPageModule.forChild(CategorysPage),
  ],
  exports: [
    CategorysPage
  ]
})
export class CategorysPageModule {}
