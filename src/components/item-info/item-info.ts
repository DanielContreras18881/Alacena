import { Component } from '@angular/core';

import { ViewController, NavParams } from 'ionic-angular';

import { Item } from '../../components/item-data/item-data';

/**
 * Modal continer to show item data to edit or create
 *
 * @export
 * @class ItemInfoPage
 */
@Component({
  templateUrl: 'item-info.html'
})
export class ItemInfoPage {
  item: Item;
  editing: boolean;
  icons: string[];
  constructor(private view: ViewController, params: NavParams) {
    this.item = params.get('newItem');
    this.editing = params.get('editing');
    this.icons = params.get('icons');
  }
  /**
   * Close modal saving data
   *
   * @memberof ItemInfoPage
   */
  save() {
    this.view.dismiss(this.item);
  }
  /**
   * Close modal without saving data
   *
   * @memberof ItemInfoPage
   */
  close() {
    this.view.dismiss();
  }
}
