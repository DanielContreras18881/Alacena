import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RemindersComponent } from './reminders-component';

@NgModule({
  declarations: [
    RemindersComponent,
  ],
  imports: [
    IonicPageModule.forChild(RemindersComponent),
  ],
  exports: [
    RemindersComponent
  ]
})
export class RemindersComponentModule {}
