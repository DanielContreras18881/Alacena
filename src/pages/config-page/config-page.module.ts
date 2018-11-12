import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { ConfigPage } from './config-page';

@NgModule({
  declarations: [
    ConfigPage,
  ],
  imports: [
    IonicPageModule.forChild(ConfigPage),
    TranslateModule.forChild()
  ],
  exports: [
    ConfigPage
  ]
})
export class ConfigPageModule {}
