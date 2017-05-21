import {Component} from '@angular/core';

import { NavController, AlertController} from 'ionic-angular';

import {PipeFilterElements} from '../../pipes/pipefilterElements';

import {OrderBy} from '../../pipes/orderBy';

import {GlobalVars} from '../../providers/global-vars/global-vars';

import {CategoriesService} from '../../providers/categories/categoriesService';
/*
  Generated class for the ItemsPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'items.html',
  providers: [PipeFilterElements, OrderBy, CategoriesService]
})
export class ItemsPage {
  public items: any;
  public searchBar: boolean;
  public searchItem: string;
  public icons: any;
  public enableSelectToRemove: boolean;
  public itemsToRemove: any;

  constructor(
              public nav: NavController,
              public alertCtrl: AlertController,
              private order: OrderBy,
              private catService: CategoriesService,
              private globalVars: GlobalVars,
              private filterElements: PipeFilterElements) {}

  ngOnInit() {
    this.itemsToRemove = [];
    this.searchBar = false;
    this.enableSelectToRemove = false;
    this.globalVars.getItemsData().then(data => {
      this.items = data;
      this.initializeItems();
    });
    this.globalVars.getDefaulIconsData().then(data => {
      this.icons = data;
    });
  }

  initializeItems() {
    this.items = this.order.transform(this.items, ['+nombreElemento']);
    this.globalVars.getListsData().then(data => {
      let lists = data;
      let itemsFilled = [];
      this.items.forEach((item, index) => {
        let auxItem = item;
        auxItem.lists = this.filterElements.transform(lists, item.nombreElemento);
        itemsFilled.push(auxItem);
      });
      this.items = itemsFilled;
    });
  }

  searchMatches(event) {
    this.initializeItems();
    if (this.searchItem && this.searchItem.trim() !== '') {
      this.items = this.items.filter((item) => {
        return (item.nombreElemento.toLowerCase().indexOf(this.searchItem.toLowerCase()) > -1);
      });
    }
  }

  toggleSearchBar(event) {
    this.searchBar = !this.searchBar;
  }

  changeItemCategory(event, item) {
    this.catService.changeCategoryIcon(item.category, this.icons);
  }

  removeItem(event, item) {
    let confirm = this.alertCtrl.create({
      title: 'Removing ' + item.nombreElemento,
      message: 'Do you like to remove ' + item.nombreElemento,
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
            // this.globalVars.getItemsData().splice(this.globalVars.getItemsData().indexOf(item), 1);
            this.items.splice(this.items.indexOf(item), 1);
            // TODO : Store changes
          }
        }
      ]
    });
    confirm.present();
  }

  selectToSendShoppingList(event) {
    let move = this.alertCtrl.create();
    move.setTitle('Move to LISTA_COMPRA');

    this.items.forEach((item: any) => {
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
          let newItem = {
                  'category': auxItem.category,
                  'measurement': auxItem.category.measurement,
                  'nombreElemento': auxItem.nombreElemento,
                  'colorElemento': '',
                  'colorBotones': '',
                  'colorElementoNoCaducado': '',
                  'colorBotonesNoCaducado': '',
                  'nombreLista': 'LISTA_COMPRA',
                  'cantidadElemento': 1,
                  'caduca': false,
                  'fechaCaducidad': new Date(),
                  'cantidadMinima': 1,
                  'marked': false
                };
          // TODO : Store changes
          // this.globalVars.getListData().push(newItem);
          auxItem.lists.push(newItem);
        });
      }
    });
    move.present();
  }

  discardOrShop(event, item) {
      let discardRemove = this.alertCtrl.create();
      discardRemove.setTitle('Discard ' + item.nombreElemento + ' or move to SHOPPING_LIST?');

      discardRemove.addButton({
        text: 'To SHOPPING_LIST',
        handler: data => {
          // TODO: Move selected elements to shopping list
          console.log('move to shopping list');
        }
      });
      discardRemove.addButton({
        text: 'Discard',
        handler: data => {
          // TODO: Remove elements from items list and lists
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
            // TODO: remove elements wihout list and 0 amount from lists
          }
        }
      });
      remove.present();
  }

  selectedItem(event, item) {
      console.log('Item selected' + JSON.stringify(item));
      this.itemsToRemove.push(item);
  }

  removeItems(event) {
    this.itemsToRemove.forEach((item, index) => {
      // this.globalVars.getItemsData().splice(this.globalVars.getItemsData().indexOf(item), 1);
      // TODO : Store changes
      this.items.splice(this.items.indexOf(item), 1);
    });
    this.itemsToRemove = [];
    this.enableSelectToRemove = !this.enableSelectToRemove;
  }

addItem(event) {
// TODO: create new item, opening modal[create modal such as category]
   let newItem = {
      'nombreElemento': 'NEW_ITEM',
      'category': {
        'categoryName': '',
        'icon': 'images/icons/default.png'
      },
      'measurement': 'UNIDADES'
    };
    console.log(JSON.stringify(event));
  }

  sendToShoppingList(event, item) {
    let itemSelected = this.items[this.items.indexOf(item)];
    let newShoppingListItem = {
      'category': itemSelected.category,
      'measurement': 'UNIDADES',
      'nombreElemento': itemSelected.nombreElemento,
      'colorElemento': '',
      'colorBotones': '',
      'colorElementoNoCaducado': '',
      'colorBotonesNoCaducado': '',
      'nombreLista': 'LISTA_COMPRA',
      'cantidadElemento': 1,
      'caduca': false,
      'fechaCaducidad': new Date(),
      'cantidadMinima': 1,
      'marked': false
    };
    this.items[this.items.indexOf(item)].lists.push(newShoppingListItem);
    // TODO : Store changes
    // this.globalVars.getListData().push(newShoppingListItem);
    // Logic to add to shopping list
  }
  /*
  itemTapped(event, item) {
    let infoItemModal = Modal.create(ItemInfoPage, {itemData: item});
    infoItemModal.onDismiss((item) => {
          if(item){
            this.saveItem(item);
          }
    });
    this.nav.present(infoItemModal);
  }
  */
}
