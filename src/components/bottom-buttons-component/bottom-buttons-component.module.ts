import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { BottomButtonsComponent } from './bottom-buttons-component';

@NgModule({
  declarations: [
    BottomButtonsComponent,
  ],
  imports: [
    IonicPageModule.forChild(BottomButtonsComponent),
    TranslateModule.forChild()
  ],
  exports: [
    BottomButtonsComponent
  ]
})
export class BottomButtonsComponentModule {}
