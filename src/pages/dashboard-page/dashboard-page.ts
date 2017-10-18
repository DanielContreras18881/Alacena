import { IonicPage, NavController, Platform } from 'ionic-angular';
import { AuthService } from '../../providers/auth/auth.service';
import { Component, NgZone } from '@angular/core';

import { GooglePlus } from '@ionic-native/google-plus';
import firebase from 'firebase';

import { ListPage } from '../list-page/list-page';

import { GlobalVars } from '../../providers/global-vars/global-vars';

declare var gapi: any;
declare var self: any;
declare var cordova: any;
/**
 * Generated class for the DashboardPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-dashboard-page',
  templateUrl: 'dashboard-page.html'
})
export class DashboardPage {
  shoppingListPage = {
    title: 'LISTA_COMPRA',
    component: ListPage,
    icon: 'basket'
  };
  userAccount: boolean = true;
  expires: boolean = true;
  reminders: boolean = true;
  type: string;

  userProfile: any = null;
  zone: NgZone;

  constructor(
    public navCtrl: NavController,
    public plt: Platform,
    private googlePlus: GooglePlus,
    private globalVars: GlobalVars,
    private authService: AuthService
  ) {}

  ionViewDidLoad() {
    this.zone = new NgZone({});
    self = this;
    firebase.auth().onAuthStateChanged(user => {
      this.zone.run(() => {
        if (user) {
          this.type = 'google';
          this.userProfile = user;
          self.globalVars.setUserProfile(user).then(() => {
            this.getDashboardData();
          });
        } else {
          this.userProfile = null;
          this.getDashboardData();
        }
      });
    });
  }

  getDashboardData() {
    console.log('dashboard');
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

  emailLogin() {
    this.type = 'email';
    this.authService.emailLogin().then(data => {
      console.log(data);
    });
  }

  facebookLogin() {
    this.type = 'facebook';
    this.authService.facebookLogin().then(data => {
      console.log(data);
    });
  }

  googleLogin() {
    this.type = 'google';
    this.authService.googleAuth().then(data => {
      console.log(data);
    });
  }

  twitterLogin() {
    this.type = 'twitter';
    this.authService.twitterLogin().then(data => {
      console.log(data);
    });
  }

  logout() {
    this.authService.logout(this.type);
  }

  addItemsToShoppingList() {
    // TODO: add all items required to shop to the shopping list
    alert('addItemsToShoppinList');
  }
}
