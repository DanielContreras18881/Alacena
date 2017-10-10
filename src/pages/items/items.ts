import { Component } from '@angular/core';
import {
  AlertController,
  ModalController,
  NavController,
  ToastController
} from 'ionic-angular';

import { OrderBy } from '../../pipes/orderBy';
import { PipeFilterElements } from '../../pipes/pipefilterElements';
import { CategoriesService } from '../../providers/categories/categoriesService';
import { GlobalVars } from '../../providers/global-vars/global-vars';
import { ItemInfoPage } from '../item-info/item-info';

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
  type: string = 'Item';
  public items: any;
  public searchBar: boolean;
  public searchItem: string;
  public icons: any;
  public enableSelectToRemove: boolean;
  public itemsToRemove: any;
  orderSelected: number = 1;
  shoppingList: any[] = [];
  defaultCategory: any;

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

  ngOnInit() {
    this.itemsToRemove = [];
    this.searchBar = false;
    this.enableSelectToRemove = false;
    this.globalVars.getDefaulIconsData().then(data => {
      this.icons = data;
      this.initializeItems(null);
    });
    this.globalVars.getListData('LISTA_COMPRA').then(data => {
      this.shoppingList = <any[]>data;
    });
    this.globalVars.getConfigData().then(data => {
      this.defaultCategory = (<any>data).categoryDefault;
    });
  }

  initializeItems(filter: string) {
    this.globalVars.getItemsData().then(data => {
      this.items = data;
      this.globalVars.getListsData().then(data => {
        let lists = <any[]>data;
        let itemsOnLists = [];
        lists.forEach(element => {
          this.globalVars.getListData(element.nombreLista).then(data => {
            (<any[]>data).forEach(item => {
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

  changeItemCategory(event, item) {
    this.catService.changeCategory(item.category, item).then(data => {
      item = data;
    });
  }

  removeItem(event, item) {
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
            category: auxItem.category,
            measurement: auxItem.category.measurement,
            nombreElemento: auxItem.nombreElemento,
            colorElemento: '',
            colorBotones: '',
            colorElementoNoCaducado: '',
            colorBotonesNoCaducado: '',
            nombreLista: 'LISTA_COMPRA',
            cantidadElemento: 1,
            caduca: false,
            fechaCaducidad: new Date(),
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

  discardOrShop(event, item) {
    let discardRemove = this.alertCtrl.create();
    discardRemove.setTitle(
      'Discard ' + item.nombreElemento + ' or move to SHOPPING_LIST?'
    );

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

  removeElements(removed: any[]) {
    removed.forEach(itemRemoved => {
      this.items = this.items.filter(
        item => item.nombreElemento !== itemRemoved
      );
      this.globalVars.setItemsData(this.items);
    });
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

  editItem(event, item) {
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

  sendToShoppingList(event, item) {
    let itemSelected = this.items[this.items.indexOf(item)];
    let newShoppingListItem = {
      category: itemSelected.category,
      measurement: 'UNIDADES',
      nombreElemento: itemSelected.nombreElemento,
      colorElemento: '',
      colorBotones: '',
      colorElementoNoCaducado: '',
      colorBotonesNoCaducado: '',
      nombreLista: 'LISTA_COMPRA',
      cantidadElemento: 1,
      caduca: false,
      fechaCaducidad: new Date(),
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
