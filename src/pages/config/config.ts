import {Component} from '@angular/core';

import {GlobalVars} from '../../providers/global-vars/global-vars';

/*
  Generated class for the ConfigPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/

// TODO: get data from firebase or local if not found, add functionality to manage config data

@Component({
  templateUrl: 'config.html'
})
export class ConfigPage {
  public configData;
  public idiomas;
  public idiomaSelecciondo;

  constructor(
    private globalVars: GlobalVars
  ) {
    this.globalVars.getConfigData().then(data => {
      this.configData = data;
      this.idiomas = this.configData.idiomas;
      this.idiomaSelecciondo = this.configData.idiomaDefault;
    });
  }
}
