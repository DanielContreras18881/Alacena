import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

import { Category } from '../../classes/category';

import { GlobalVars } from '../../providers/global-vars/global-vars';

/**
 * Page to manage config data for the app
 *
 * @export
 * @class ConfigPage
 */
@IonicPage()
@Component({
  selector: 'page-config-page',
  templateUrl: 'config-page.html'
})
export class ConfigPage {
  configData;
  idiomas;
  idiomaSelecciondo;
  categories: Category[];
  units = ['UNIDADES', 'LITROS', 'GRAMOS', 'KG'];
  pasos = ['0.25', '0.5', '1', '100'];
  categorySelected: string = '';

  constructor(public navCtrl: NavController, private globalVars: GlobalVars) {}

  ionViewDidLoad() {
    this.globalVars.getConfigData().then(result => {
      this.configData = <any>result;
      this.idiomas = this.configData.idiomas;
      this.idiomaSelecciondo = this.configData.idiomaDefault;
      this.categorySelected = this.configData.categoryDefault.categoryName;
      this.globalVars.getCategoriesData().then(data => {
        this.categories = <Category[]>data;
        if (
          this.categories.filter(cat => cat.categoryName === 'No Category')
            .length <= 0
        ) {
          this.categories.push({
            icon: 'images/icons/default.png',
            measurement: 'UNIDADES',
            categoryName: 'No Category',
            unitStep: 1
          });
        }
      });
    });
  }
  /**
   * On change it should save the data
   *
   * @memberof ConfigPage
   */
  onChange() {
    this.configData.categoryDefault = this.categories.filter(
      cat => cat.categoryName === this.categorySelected
    )[0];
    this.globalVars.setConfigData(this.configData);
  }
}
