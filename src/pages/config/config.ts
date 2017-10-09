import { Component } from '@angular/core';

import { GlobalVars } from '../../providers/global-vars/global-vars';

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
  public categories: any[];
  public units = ['UNIDADES', 'LITROS', 'GRAMOS', 'KG'];
  public pasos = ['0.25', '0.5', '1', '100'];
  categorySelected: string;

  constructor(private globalVars: GlobalVars) {
    this.globalVars.getCategoriesData().then(data => {
      this.categories = <any[]>data;
      this.globalVars.getConfigData().then(data => {
        this.configData = data;
        this.idiomas = this.configData.idiomas;
        this.idiomaSelecciondo = this.configData.idiomaDefault;
        this.categorySelected = this.configData.categoryDefault.categoryName;
      });
    });
  }
  onChange() {
    this.configData.categoryDefault = this.categories.filter(
      cat => cat.categoryName === this.categorySelected
    )[0];
    this.globalVars.setConfigData(this.configData);
  }
}
