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
 * Generated class for the ItemsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
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
  enableSelectToRemove: boolean;
  itemsToRemove: Item[];
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
    this.itemsToRemove = [];
    this.searchBar = false;
    this.enableSelectToRemove = false;
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

  searchMatches(event) {
    if (this.searchItem && this.searchItem.trim() !== '') {
      this.initializeItems(this.searchItem);
    } else {
      this.initializeItems(null);
    }
  }

  toggleSearchBar(event) {
    this.searchBar = !this.searchBar;
  }

  changeItemCategory(event, item: Item) {
    this.catService.changeCategory(item.category, item).then(data => {
      item = <Item>data;
    });
  }

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

  selectToRemove(event) {
    let remove = this.alertCtrl.create();
    remove.setTitle('Remove items');

    remove.addInput({
      type: 'radio',
      label: 'Empty items',
      value: 'empty',
      checked: false
    });

    remove.addInput({
      type: 'radio',
      label: 'Selected',
      value: 'selected',
      checked: false
    });

    remove.addButton('Cancel');
    remove.addButton({
      text: 'OK',
      handler: data => {
        if (data === 'selected') {
          this.itemsToRemove = [];
          this.enableSelectToRemove = !this.enableSelectToRemove;
        }
        if (data === 'empty') {
        }
      }
    });
    remove.present();
  }

  selectedItem(event, item: Item) {
    console.log('Item selected' + JSON.stringify(item));
    this.itemsToRemove.push(item);
  }

  removeElements(removed: string[]) {
    removed.forEach(itemRemoved => {
      this.items = this.items.filter(
        item => item.nombreElemento !== itemRemoved
      );
      this.globalVars.setItemsData(this.items);
    });
  }

  removeItems(event) {
    this.itemsToRemove.forEach((item, index) => {
      this.items.splice(this.items.indexOf(item), 1);
    });
    this.itemsToRemove = [];
    this.enableSelectToRemove = !this.enableSelectToRemove;
  }

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
