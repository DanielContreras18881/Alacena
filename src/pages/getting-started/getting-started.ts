import {Component,NgZone} from '@angular/core';

import { GooglePlus } from '@ionic-native/google-plus';
import firebase from 'firebase';

import { NavController, Platform} from 'ionic-angular';

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

  userProfile: any = null;
  zone: NgZone;

  constructor(
    public plt: Platform,
    private googlePlus: GooglePlus,
    public navCtrl: NavController,
    private globalVars: GlobalVars) {

      this.zone = new NgZone({});
      firebase.auth().onAuthStateChanged( user => {
        this.zone.run( () => {
          if (user){
            this.userProfile = user;
          } else {
            this.userProfile = null;
          }
        });
      });

      globalVars.getListsData().then(data => {

      });
      globalVars.getListData().then(data => {

      });
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
//https://console.developers.google.com/apis/credentials?project=develop-apps-chony-alacena&authuser=1
//https://console.firebase.google.com/u/1/project/alacena-58699/settings/general/
    var provider = new firebase.auth.GoogleAuthProvider();
    var res = null;
    if(this.plt.is('mobile')){
      firebase.auth().signInWithPopup(provider).then(
        (result) => {
          console.log(result)
          this.userProfile = result.user;
        },
        (error) => {
          console.log(error)
        }
      );
    }else{
          firebase.auth().signInWithRedirect(provider).then(
            (result) => {
              console.log(result)
              this.userProfile = result.user;
            },
            (error) => {
              console.log(error)
            }
          );
    }

    /*
      this.googlePlus.login({
        'webClientId': '1053014364968-i826ic0mfi6g0p4rk47ma09jl0gehgai.apps.googleusercontent.com',
        'offline': true
      }).then( res => {
        firebase.auth().signInWithCredential(firebase.auth.GoogleAuthProvider.credential(res.idToken))
          .then( success => {
            console.log("Firebase success: " + JSON.stringify(success));
          })
          .catch( error => console.log("Firebase failure: " + JSON.stringify(error)));
      }).catch(err => console.error("Error: ", err));
      */
  }

  addItemsToShoppingList() {
// TODO: add all items required to shop to the shopping list
    alert('addItemsToShoppinList');
  }
}
