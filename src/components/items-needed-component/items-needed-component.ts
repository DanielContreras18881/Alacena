import { GlobalVars } from '../../providers/global-vars/global-vars';
import { ListItem } from '../../classes/listItem';
import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

/**
 * Component to show and manage items needed to shop on the dashboard
 * 
 * @export
 * @class ItemsNeededComponent
 */
@Component({
  selector: 'items-needed-component',
  templateUrl: 'items-needed-component.html'
})
export class ItemsNeededComponent {
  list: ListItem[];

  constructor(private globalVars: GlobalVars, private view: ViewController) {}

  ionViewDidLoad() {
    // TODO: show alert with items to expire, expiry date and list
    this.globalVars.getListData('LISTA_COMPRA').then(listData => {
      console.log(listData);
      this.list = <ListItem[]>listData;
    });
  }
  /**
	 * Close modal discarding data
	 * 
	 * @memberof ItemsBestBeforeComponent
	 */
  close() {
    this.view.dismiss();
  }
  /**
	 * Add items to shopping list, from needed to shop
	 * 
	 * @memberof DashboardPage
	 */
  addItemsToShoppingList() {
    // TODO: add all items required to shop to the shopping list
    alert('addItemsToShoppinList');
    this.view.dismiss();
  }
}
