import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  AlertController,
  ModalController,
  ToastController
} from 'ionic-angular';

import { Category } from '../../classes/category';
import { ListItem } from '../../classes/listItem';
import { Icon } from '../../classes/icon';
import { Item } from '../../classes/item';
import { List } from '../../classes/list';

import { OrderBy } from '../../pipes/orderBy';
import { PipeFilterElements } from '../../pipes/pipefilterElements';
import { CategoriesService } from '../../providers/categories/categoriesService';
import { GlobalVars } from '../../providers/global-vars/global-vars';
import { ItemInfoPage } from '../../components/item-info/item-info';
/**
 * Page to manage items on the app
 * 
 * @export
 * @class ItemsPage
 */
@IonicPage()
@Component({
  selector: 'page-items-page',
  templateUrl: 'items-page.html',
  providers: [PipeFilterElements, OrderBy, CategoriesService]
})
export class ItemsPage {
  type: string = 'Item';
  items: Item[];
  searchBar: boolean;
  searchItem: string;
  icons: Icon[];
  orderSelected: number = 1;
  shoppingList: ListItem[] = [];
  defaultCategory: Category;

  constructor(
    public mod: ModalController,
    public nav: NavController,
    public alertCtrl: AlertController,
    private order: OrderBy,
    private catService: CategoriesService,
    private globalVars: GlobalVars,
    private filterElements: PipeFilterElements,
    private toastCtrl: ToastController
  ) {}

  ionViewDidLoad() {
    this.searchBar = false;
    this.globalVars.getDefaulIconsData().then(data => {
      this.icons = <Icon[]>data;
      this.initializeItems(null);
    });
    this.globalVars.getListData('LISTA_COMPRA').then(data => {
      this.shoppingList = <ListItem[]>data;
    });
    this.globalVars.getConfigData().then(data => {
      this.defaultCategory = (<any>data).categoryDefault;
    });
  }
  /**
	 * Initialize items data
	 * 
	 * @param {string} filter 
	 * @memberof ItemsPage
	 */
  initializeItems(filter: string) {
    this.globalVars.getItemsData().then(data => {
      this.items = <Item[]>data;
      this.globalVars.getListsData().then(data => {
        let lists = <List[]>data;
        let itemsOnLists = [];
        lists.forEach(element => {
          this.globalVars.getListData(element.nombreLista).then(data => {
            (<ListItem[]>data).forEach(item => {
              itemsOnLists.push(item);
            });
            let itemsFilled = [];
            this.items.forEach((item, index) => {
              let auxItem = item;
              auxItem.lists = this.filterElements.transform(
                itemsOnLists,
                item.nombreElemento
              );
              itemsFilled.push(auxItem);
            });
            this.items = itemsFilled;
            this.sortItems(this.orderSelected);
            if (filter) {
              this.items = this.items.filter(item => {
                return (
                  item.nombreElemento
                    .toLowerCase()
                    .indexOf(this.searchItem.toLowerCase()) > -1
                );
              });
            }
          });
        });
      });
    });
  }
  /**
	 * Event to search items based on input filled
	 * 
	 * @param {any} event 
	 * @memberof ItemsPage
	 */
  searchMatches(event) {
    if (this.searchItem && this.searchItem.trim() !== '') {
      this.initializeItems(this.searchItem);
    } else {
      this.initializeItems(null);
    }
  }
  /**
	 * Event to show or hide search bar
	 * 
	 * @param {any} event 
	 * @memberof ItemsPage
	 */
  toggleSearchBar(event) {
    this.searchBar = !this.searchBar;
  }
  /**
	 * Event to change category of the item
	 * 
	 * @param {any} event 
	 * @param {Item} item 
	 * @memberof ItemsPage
	 */
  changeItemCategory(event, item: Item) {
    this.catService.changeCategory(item.category, item).then(data => {
      item = <Item>data;
    });
  }
  /**
	 * Event to remove a item
	 * 
	 * @param {any} event 
	 * @param {Item} item 
	 * @memberof ItemsPage
	 */
  removeItem(event, item: Item) {
    let confirm = this.alertCtrl.create({
      title: 'Removing ' + item.nombreElemento,
      message: 'Do you like to remove ' + item.nombreElemento + '?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            console.log('No removed');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.items.splice(this.items.indexOf(item), 1);
            this.globalVars.setItemsData(this.items);
          }
        }
      ]
    });
    confirm.present();
  }
  /**
	 * Event to show events to send to shopping list
	 * 
	 * @param {any} event 
	 * @memberof ItemsPage
	 */
  selectToSendShoppingList(event) {
    let move = this.alertCtrl.create();
    move.setTitle('Move to LISTA_COMPRA');

    this.items.forEach((item: Item) => {
      console.log(item.lists);
      if (item.lists.length === 0) {
        move.addInput({
          type: 'checkbox',
          label: item.nombreElemento,
          value: item.nombreElemento,
          checked: false
        });
      }
    });

    move.addButton('Cancel');
    move.addButton({
      text: 'OK',
      handler: data => {
        data.forEach((item, index) => {
          console.log(item);
          console.log(this.items);
          let auxItem = this.filterElements.transform(this.items, item)[0];
          console.log(auxItem);
          let newItem: ListItem = {
            category: auxItem.category,
            nombreElemento: auxItem.nombreElemento,
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
          auxItem.lists.push(newItem);
        });
      }
    });
    move.present();
  }
  /**
	 * Event to confirm to send to shopping list or discard elements
	 * 
	 * @param {any} event 
	 * @param {Item} item 
	 * @memberof ItemsPage
	 */
  discardOrShop(event, item: Item) {
    let discardRemove = this.alertCtrl.create();
    discardRemove.setTitle(
      'Discard ' + item.nombreElemento + ' or move to SHOPPING_LIST?'
    );

    discardRemove.addButton({
      text: 'To SHOPPING_LIST',
      handler: data => {
        console.log('move to shopping list');
      }
    });
    discardRemove.addButton({
      text: 'Discard',
      handler: data => {
        console.log('discard from lists and item list');
      }
    });
    discardRemove.present();
  }
  /**
	* Event to remove selected items
	* 
	* @param {string[]} removed 
	* @memberof ItemsPage
   */
  removeElements(removed: string[]) {
    removed.forEach(itemRemoved => {
      this.items = this.items.filter(
        item => item.nombreElemento !== itemRemoved
      );
      this.globalVars.setItemsData(this.items);
    });
  }
  /**
	 * Event to edit a item
	 * 
	 * @param {any} event 
	 * @param {Item} item 
	 * @memberof ItemsPage
	 */
  editItem(event, item: Item) {
    let oldItem = item.nombreElemento;
    let edit = this.alertCtrl.create({
      title: 'Edit Item',
      inputs: [
        {
          name: 'nombreElemento',
          value: oldItem,
          type: 'text',
          placeholder: 'Name'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Confirm',
          handler: data => {
            if (item.lists.length > 0) {
              this.items.push(JSON.parse(JSON.stringify(item)));
              item.lists = [];
            }
            item.nombreElemento = data.nombreElemento;
            this.globalVars.setItemsData(this.items);
            this.sortItems(this.orderSelected);
          }
        }
      ]
    });
    edit.present();
  }
  /**
	 * Even to add a new item
	 * 
	 * @param {string} newItem 
	 * @memberof ItemsPage
	 */
  addItem(newItem: string) {
    if (
      this.items.filter(
        item => item.nombreElemento.toLowerCase() === newItem.toLowerCase()
      ).length === 0
    ) {
      this.items.push({
        nombreElemento: newItem,
        category: this.defaultCategory
      });
      this.globalVars.setItemsData(this.items);
    } else {
      const toast = this.toastCtrl.create({
        message: 'This item already exists!',
        duration: 1000,
        position: 'bottom'
      });
      toast.present();
    }
  }
  /**
	 * Event to sort items
	 * 
	 * @param {number} orderBy 
	 * @memberof ItemsPage
	 */
  sortItems(orderBy: number) {
    this.orderSelected = orderBy;
    switch (orderBy) {
      case 1:
        this.items = this.order.transform(this.items, ['+nombreElemento']);
        break;
      case 2:
        this.items = this.items.sort((a: any, b: any) => {
          if (a.category.categoryName < b.category.categoryName) return -1;
          if (a.category.categoryName > b.category.categoryName) return 1;
          return 0;
        });
        break;
      case 3:
        this.items = this.items.sort((a: any, b: any) => {
          if (a.category.measurement < b.category.measurement) return -1;
          if (a.category.measurement > b.category.measurement) return 1;
          return 0;
        });
        break;
    }
  }
  /**
	 * Even to show options to sort items
	 * 
	 * @param {any} event 
	 * @memberof ItemsPage
	 */
  reorder(event) {
    let reorder = this.alertCtrl.create();
    reorder.setTitle('Sort by');

    reorder.addInput({
      type: 'radio',
      label: 'NOMBRE',
      value: '1',
      checked: this.orderSelected === 1
    });

    reorder.addInput({
      type: 'radio',
      label: 'CATEGORIA',
      value: '2',
      checked: this.orderSelected === 2
    });

    reorder.addInput({
      type: 'radio',
      label: 'PASO_MEDIDA',
      value: '3',
      checked: this.orderSelected === 3
    });

    reorder.addButton('Cancel');
    reorder.addButton({
      text: 'OK',
      handler: data => {
        this.sortItems(Number.parseInt(data));
      }
    });

    reorder.present();
  }
  /**
	 * Event to send a item to shopping list
	 * 
	 * @param {any} event 
	 * @param {ListItem} item 
	 * @memberof ItemsPage
	 */
  sendToShoppingList(event, item: ListItem) {
    let itemSelected = this.items[this.items.indexOf(item)];
    let newShoppingListItem: ListItem = {
      category: itemSelected.category,
      nombreElemento: itemSelected.nombreElemento,
      colorElemento: '',
      colorBotones: '',
      nombreLista: 'LISTA_COMPRA',
      cantidadElemento: 1,
      caduca: false,
      fechaCaducidad: null,
      cantidadMinima: 1,
      marked: false
    };
    if (
      this.shoppingList.filter(
        element => element.nombreElemento.toLowerCase() === item.nombreElemento
      ).length === 0
    ) {
      this.items[this.items.indexOf(item)].lists.push(newShoppingListItem);
      this.shoppingList.push(newShoppingListItem);
      this.globalVars.setListData('LISTA_COMPRA', this.shoppingList);
    } else {
      let addAmount = this.alertCtrl.create();
      addAmount.setTitle(
        item.nombreElemento + ' already exists, choose an option'
      );
      addAmount.addButton('Discard');
      addAmount.addButton({
        text: 'Add amount',
        handler: data => {
          this.shoppingList.filter(
            element =>
              element.nombreElemento.toLowerCase() ===
              item.nombreElemento.toLowerCase()
          )[0].cantidadElemento +=
            item.cantidadElemento;
          this.globalVars.setListData('LISTA_COMPRA', this.shoppingList);
          this.initializeItems(null);
        }
      });
      addAmount.present();
    }
  }
}
