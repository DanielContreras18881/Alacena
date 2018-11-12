import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { RemindersComponent } from './reminders-component';

@NgModule({
  declarations: [
    RemindersComponent,
  ],
  imports: [
    IonicPageModule.forChild(RemindersComponent),
    TranslateModule.forChild()
  ],
  exports: [
    RemindersComponent
  ]
})
export class RemindersComponentModule {}
