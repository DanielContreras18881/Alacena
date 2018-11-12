import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { BackupPage } from './backup-page';

@NgModule({
  declarations: [
    BackupPage,
  ],
  imports: [
    IonicPageModule.forChild(BackupPage),
    TranslateModule.forChild()
  ],
  exports: [
    BackupPage
  ]
})
export class BackupPageModule {}
