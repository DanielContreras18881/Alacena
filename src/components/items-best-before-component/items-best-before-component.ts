import { GlobalVars } from '../../providers/global-vars/global-vars';
import { ListItem } from '../../classes/listItem';
import { List } from '../../classes/list';
import { OrderBy } from '../../pipes/orderBy';
import moment from 'moment';
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
  templateUrl: 'items-best-before-component.html',
  providers: [OrderBy]
})
export class ItemsBestBeforeComponent {
  list: ListItem[] = [];

  constructor(
    private globalVars: GlobalVars,
    private order: OrderBy,
    private view: ViewController
  ) {}
  ionViewDidLoad() {
    this.initializeItems();
  }
  initializeItems() {
    this.globalVars.getListsData().then(data => {
      let lists = <List[]>data;
      let itemsOnLists = [];
      lists.forEach(element => {
        this.globalVars.getListData(element.nombreLista).then(data => {
          (<ListItem[]>data).forEach(item => {
            itemsOnLists.push(item);
          });
          itemsOnLists.forEach((item, index) => {
            let auxItem = item;
            if (auxItem.caduca) {
              if (
                this.list.filter(
                  listItem => listItem.nombreElemento === auxItem.nombreElemento
                ).length <= 0
              ) {
                this.list.push(<ListItem>auxItem);
              }
            }
          });
        });
      });
      this.list = this.order.transform(this.list, ['+fechaCaducidad']);
    });
  }
  /**
	* Check expiry date of the item
	* 
	* @param {any} expiryDate 
	* @returns 
	* @memberof Item
	*/
  checkExpiryDate(expiryDate) {
    if (moment().isAfter(moment(expiryDate, 'YYYY-MM-DDTHH:mm:ss.SSSZ'))) {
      return 'expired';
    } else {
      if (
        moment().isAfter(
          moment(expiryDate, 'YYYY-MM-DDTHH:mm:ss.SSSZ').subtract(7, 'days')
        )
      ) {
        return 'nearToExpire';
      }
    }
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
