import { Icon } from '../../classes/icon';
import { Component } from '@angular/core';

import { ViewController, NavParams } from 'ionic-angular';

import { Item } from '../../components/item-data/item-data';

/*
  Generated class for the ItemInfoPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'item-info.html'
})
export class ItemInfoPage {
  item: Item;
  editing: boolean;
  icons: Icon[];
  constructor(private view: ViewController, params: NavParams) {
    this.item = params.get('newItem');
    this.editing = params.get('editing');
    this.icons = params.get('icons');
  }

  save() {
    this.view.dismiss(this.item);
  }

  close() {
    this.view.dismiss();
  }
}
