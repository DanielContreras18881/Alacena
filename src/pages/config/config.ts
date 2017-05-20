import {Component} from '@angular/core';

import {ConfigData} from '../../providers/data/config-data';

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

  constructor(private configDataStore: ConfigData) {
    this.configDataStore.getConfigData().then(data => {
      this.configData = data;
      this.idiomas = this.configData.idiomas;
      this.idiomaSelecciondo = this.configData.idiomaDefault;
    });
  }
}
