import { ListItem } from '../../classes/listItem';
import { Injectable } from '@angular/core';
import { AutoCompleteService } from 'ionic2-auto-complete';

import { GlobalVars } from '../../providers/global-vars/global-vars';
/**
 * Directive to get items on a list as a searchable input
 *
 * @export
 * @class ItemsOnList
 * @implements {AutoCompleteService}
 */
@Injectable()
export class ItemsOnList implements AutoCompleteService {
  labelAttribute = 'nombreElemento';
  items: ListItem[] = [];

  constructor(
    private globalVars: GlobalVars
    ) {
    this.globalVars.getItemsData().then(data => {
      this.items = <ListItem[]>data;
    });
  }
  /**
	* Return search results based on the input typed
	*
	* @param {string} keyword
	* @returns
	* @memberof ItemsOnList
   */
  getResults(keyword: string) {
    return this.items.filter(
      item =>
        item.nombreElemento.toLowerCase().indexOf(keyword.toLowerCase()) > -1
    );
  }
}
