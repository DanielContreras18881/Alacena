import {Component} from '@angular/core';

import { NavController} from 'ionic-angular';

import {ListPage} from '../list/list';

import {GlobalVars} from '../../providers/global-vars/global-vars';

@Component({
  templateUrl: 'getting-started.html'
})
export class GettingStartedPage {
  private shoppingListPage = { title: 'LISTA_COMPRA', component: ListPage, icon: 'basket' };
  private userAccount: boolean = true;
  private expires: boolean = true;
  private reminders: boolean = true;

  constructor(private globalVars: GlobalVars, public navCtrl: NavController) {
  }

  openInternalPage(page) {
    this.navCtrl.push(page.component, {
      list: page.title
    });
  }

  showItemsToShop() {
// TODO: show alert with items to shop
    alert('Items a comprar');
  }

  showExpireItems() {
// TODO: show alert with items to expire, expiry date and list
    alert('showExpireItems');
  }

  showReminders() {
// TODO: show list of reminders,view, loaded from local
    alert('showReminders');
  }

  editReminder() {
// TODO: view to edit a reminder
    alert('editReminder');
  }

  addRemoveUserAccount() {
// TODO: login/logout from firebase
    alert('addRemoveUserAccount');
  }

  addItemsToShoppingList() {
// TODO: add all items required to shop to the shopping list
    alert('addItemsToShoppinList');
  }
}
