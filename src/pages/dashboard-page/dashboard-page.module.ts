import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { DashboardPage } from './dashboard-page';

@NgModule({
  declarations: [
    DashboardPage,
  ],
  imports: [
    IonicPageModule.forChild(DashboardPage),
    TranslateModule.forChild()
  ],
  exports: [
    DashboardPage
  ]
})
export class DashboardPageModule {}
