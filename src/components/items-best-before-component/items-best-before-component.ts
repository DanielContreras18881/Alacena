import { GlobalVars } from '../../providers/global-vars/global-vars';
import { ListItem } from '../../classes/listItem';
import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

/**
 * Component to show and manage items near to expire for the dashboard
 * 
 * @export
 * @class ItemsBestBeforeComponent
 */
@Component({
  selector: 'items-best-before-component',
  templateUrl: 'items-best-before-component.html'
})
export class ItemsBestBeforeComponent {
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
}
