import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CategoryComponent } from './category-component';

@NgModule({
  declarations: [
    CategoryComponent,
  ],
  imports: [
    IonicPageModule.forChild(CategoryComponent),
  ],
  exports: [
    CategoryComponent
  ]
})
export class CategoryComponentModule {}
