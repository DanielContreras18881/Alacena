import { ListItem } from '../../classes/listItem';
import { Injectable } from '@angular/core';
import { AutoCompleteService } from 'ionic2-auto-complete';

import { GlobalVars } from '../../providers/global-vars/global-vars';

@Injectable()
export class ItemsOnList implements AutoCompleteService {
  labelAttribute = 'nombreElemento';
  items: ListItem[] = [];

  constructor(private globalVars: GlobalVars) {
    this.globalVars.getItemsData().then(data => {
      this.items = <ListItem[]>data;
    });
  }
  getResults(keyword: string) {
    return this.items.filter(
      item =>
        item.nombreElemento.toLowerCase().indexOf(keyword.toLowerCase()) > -1
    );
  }
}
