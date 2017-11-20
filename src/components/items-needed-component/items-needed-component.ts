import { GlobalVars } from '../../providers/global-vars/global-vars';
import { ListItem } from '../../classes/listItem';
import { Item } from '../../classes/item';
import { List } from '../../classes/list';
import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

import { PipeFilterElements } from '../../pipes/pipefilterElements';

/**
 * Component to show and manage items needed to shop on the dashboard
 * 
 * @export
 * @class ItemsNeededComponent
 */
@Component({
  selector: 'items-needed-component',
  templateUrl: 'items-needed-component.html',
  providers: [PipeFilterElements]
})
export class ItemsNeededComponent {
  list: ListItem[] = [];
  shoppingList: ListItem[] = [];

  constructor(
    private globalVars: GlobalVars,
    private view: ViewController,
    private filterElements: PipeFilterElements
  ) {}

  ionViewDidLoad() {
    this.initializeItems();
    this.globalVars.getListData('LISTA_COMPRA').then(data => {
      this.shoppingList = <ListItem[]>data;
    });
  }
  initializeItems() {
    this.globalVars.getItemsData().then(data => {
      let items = <Item[]>data;
      this.globalVars.getListsData().then(data => {
        let lists = <List[]>data;
        let itemsOnLists = [];
        lists.forEach(element => {
          this.globalVars.getListData(element.nombreLista).then(data => {
            (<ListItem[]>data).forEach(item => {
              itemsOnLists.push(item);
            });
            items.forEach((item, index) => {
              let auxItem = item;
              if (
                itemsOnLists.filter(
                  itemOnList =>
                    itemOnList.nombreElemento === item.nombreElemento
                ).length <= 0
              ) {
                if (
                  this.list.filter(
                    listItem =>
                      listItem.nombreElemento === auxItem.nombreElemento
                  ).length <= 0
                ) {
                  this.list.push(<ListItem>auxItem);
                }
              }
            });
          });
        });
      });
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
    this.list.forEach((item, index) => {
      let newItem: ListItem = {
        category: item.category,
        nombreElemento: item.nombreElemento,
        colorElemento: '',
        colorBotones: '',
        nombreLista: 'LISTA_COMPRA',
        cantidadElemento: 1,
        caduca: false,
        fechaCaducidad: null,
        cantidadMinima: 1,
        marked: false
      };
      this.shoppingList.push(newItem);
      this.globalVars.setListData('LISTA_COMPRA', this.shoppingList);
      this.list = this.list.filter(
        aux => aux.nombreElemento !== item.nombreElemento
      );
    });
    this.view.dismiss();
  }
}
