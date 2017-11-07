import { Reminder } from '../../classes/reminder';
import { RemindersProvider } from '../../providers/reminders-provider';
import { IonicPage, NavController, Platform } from 'ionic-angular';
import { AuthService } from '../../providers/auth/auth.service';
import { Component, NgZone } from '@angular/core';

import { Pipe, PipeTransform } from '@angular/core';

import { GooglePlus } from '@ionic-native/google-plus';
import firebase from 'firebase';

import { ListPage } from '../list-page/list-page';

import { GlobalVars } from '../../providers/global-vars/global-vars';

declare var gapi: any;
declare var self: any;
declare var cordova: any;
/**
 * Page to show initial data and manage login
 * 
 * @export
 * @class DashboardPage
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
  reminders: boolean = false;

  remindersList: Reminder[] = [];

  userProfile: any = null;
  zone: NgZone;

  constructor(
    public navCtrl: NavController,
    public plt: Platform,
    private googlePlus: GooglePlus,
    private globalVars: GlobalVars,
    private authService: AuthService,
    private remindersData: RemindersProvider
  ) {}

  ionViewDidLoad() {
    this.zone = new NgZone({});
    self = this;
    firebase.auth().onAuthStateChanged(user => {
      // if login state changed
      this.zone.run(() => {
        if (user) {
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
  /**
	 * Get data to show on dashboard
	 * 
	 * @memberof DashboardPage
	 */
  getDashboardData() {
    console.log('dashboard');
    this.remindersData.getReminders().then(data => {
      this.remindersList = <Reminder[]>data;
      if (this.remindersList.length > 0) {
        this.reminders = true;
      }
    });
  }
  /**
	 * Open a page of the app
	 * 
	 * @param {any} page 
	 * @memberof DashboardPage
	 */
  openInternalPage(page) {
    this.navCtrl.push(page.component, {
      list: page.title
    });
  }
  /**
	 * Show items needed to shop
	 * 
	 * @memberof DashboardPage
	 */
  showItemsToShop() {
    // TODO: show alert with items to shop
    alert('Items a comprar');
  }
  /**
	 * Show list of items near to expire
	 * 
	 * @memberof DashboardPage
	 */
  showExpireItems() {
    // TODO: show alert with items to expire, expiry date and list
    alert('showExpireItems');
  }
  /**
	 * Show list reminders created
	 * 
	 * @memberof DashboardPage
	 */
  showReminders() {
    // TODO: show list of reminders,view, loaded from local
    alert('showReminders');
    console.log(this.remindersList);
  }
  /**
	 * Edit a reminder
	 * 
	 * @memberof DashboardPage
	 */
  editReminder(reminder: Reminder) {
    // TODO: view to edit a reminder
    alert('editReminder' + reminder);
  }
  /**
	 * Loggin by email
	 * 
	 * @memberof DashboardPage
	 */
  emailLogin() {
    this.authService.emailLogin().then(data => {
      console.log(data);
    });
  }
  /**
	 * Login by facebook
	 * 
	 * @memberof DashboardPage
	 */
  facebookLogin() {
    this.authService.facebookLogin().then(data => {
      console.log(data);
    });
  }
  /**
	 * Login by google
	 * 
	 * @memberof DashboardPage
	 */
  googleLogin() {
    this.authService.googleAuth().then(data => {
      console.log(data);
    });
  }
  /**
	 * Login by twitter
	 * 
	 * @memberof DashboardPage
	 */
  twitterLogin() {
    this.authService.twitterLogin().then(data => {
      console.log(data);
    });
  }
  /**
	 * Add items to shopping list, from needed to shop
	 * 
	 * @memberof DashboardPage
	 */
  addItemsToShoppingList() {
    // TODO: add all items required to shop to the shopping list
    alert('addItemsToShoppinList');
  }
  /**
	 * Logout
	 * 
	 * @memberof DashboardPage
	 */
  logout() {
    this.authService.logout();
  }
}
