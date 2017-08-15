import { AuthService } from '../../providers/auth/auth.service';
import { LoginComponent } from '../../components/login-component/login-component';
import { Component, NgZone } from "@angular/core";

import { GooglePlus } from "@ionic-native/google-plus";
import firebase from "firebase";

import { ModalController, NavController, Platform } from 'ionic-angular';

import { ListPage } from "../list/list";

import { GlobalVars } from "../../providers/global-vars/global-vars";

declare var gapi: any;
declare var self: any;

@Component({
  templateUrl: "getting-started.html"
})
export class GettingStartedPage {
  private shoppingListPage = {
    title: "LISTA_COMPRA",
    component: ListPage,
    icon: "basket"
  };
  private userAccount: boolean = true;
  private expires: boolean = true;
  private reminders: boolean = true;
  private type: string;

  userProfile: any = null;
  zone: NgZone;

  constructor(
    public plt: Platform,
    private googlePlus: GooglePlus,
    public navCtrl: NavController,
    private globalVars: GlobalVars,
    public modalCtrl: ModalController,
    private authService: AuthService
  ) {
    this.zone = new NgZone({});
    self = this;
    firebase.auth().onAuthStateChanged(user => {
      this.zone.run(() => {
        if (user) {
			  this.type = 'google';
          this.userProfile = user;
          self.globalVars.setUserProfile(user);
          //gapi.auth.setToken(this.userProfile.oauthAccessToken);
        } else {
          this.userProfile = null;
        }
      });

      globalVars.getListsData().then(data => {
        //console.log(data)
      });
      //globalVars.getListData().then(data => {});
    });
  }

  openInternalPage(page) {
    this.navCtrl.push(page.component, {
      list: page.title
    });
  }

  showItemsToShop() {
    // TODO: show alert with items to shop
    alert("Items a comprar");
  }

  showExpireItems() {
    // TODO: show alert with items to expire, expiry date and list
    alert("showExpireItems");
  }

  showReminders() {
    // TODO: show list of reminders,view, loaded from local
    alert("showReminders");
  }

  editReminder() {
    // TODO: view to edit a reminder
    alert("editReminder");
  }

  selectLoginType() {
    let loginModal = this.modalCtrl.create(LoginComponent);
    loginModal.onDidDismiss(data => {
		 console.log(data)
      if (data === "google") {
        console.log("LOGGED");
        this.type = data;
      } else {
        console.log(data);
      }
    });
    loginModal.present();
  }

  logout() {
    this.authService.logout(this.type);
  }

  addItemsToShoppingList() {
    // TODO: add all items required to shop to the shopping list
    alert("addItemsToShoppinList");
  }
}
