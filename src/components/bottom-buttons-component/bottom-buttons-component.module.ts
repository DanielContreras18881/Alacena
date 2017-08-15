import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BottomButtonsComponent } from './bottom-buttons-component';

@NgModule({
  declarations: [
    BottomButtonsComponent,
  ],
  imports: [
    IonicPageModule.forChild(BottomButtonsComponent),
  ],
  exports: [
    BottomButtonsComponent
  ]
})
export class BottomButtonsComponentModule {}
