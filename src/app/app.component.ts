import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, Nav, App,
//  LoadingController
} from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';;

import {GettingStartedPage} from '../pages/getting-started/getting-started';
import {ListPage} from '../pages/list/list';
import {ListsPage} from '../pages/lists/lists';
import {ItemsPage} from '../pages/items/items';
import {ConfigPage} from '../pages/config/config';
import {AboutPage} from '../pages/about/about';
import {CategoriesPage} from '../pages/categories/categories';


import { Storage } from '@ionic/storage';
import firebase from 'firebase';


@Component({
  selector: 'app-root',
  templateUrl: 'app.html'
})
export class Alacena {

  @ViewChild(Nav) nav: Nav;

  rootPage = GettingStartedPage;

  pages: Array<{title: string, icon: string, component: any}>;

  constructor(
    platform: Platform,
    public menu: MenuController,
    public app: App,
    public splashScreen: SplashScreen,
    public statusBar: StatusBar,
    private storage: Storage
    // private load: LoadingController
  ) {

    firebase.initializeApp({
      apiKey: "AIzaSyCq_XZBezFcC_iAWa-i12swT0YL9sqvjfM",//Firebase
      //apiKey: "AIzaSyCYbNChWjDtLYXkm_ayPQeb4t4TjWDXWd0",//GoogleDevConsole
      authDomain: "alacena-58699.firebaseapp.com",
      databaseURL: "https://alacena-58699.firebaseio.com",
      projectId: "alacena-58699",
      storageBucket: "alacena-58699.appspot.com",
      messagingSenderId: "354280052179"
    });

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.splashScreen.hide();
      this.statusBar.styleDefault();
    });

    this.storage.set('name', 'Max');
    //loading: any;

    this.pages = [
      { title: 'Inicio', component: GettingStartedPage, icon: 'contact' },
      { title: 'LISTA_COMPRA', component: ListPage, icon: 'basket' },
      { title: 'Lists', component: ListsPage, icon: 'list-box' },
      { title: 'Items', component: ItemsPage, icon: 'list' },
      { title: 'Categories', component: CategoriesPage, icon: 'paper' },
      { title: 'Config', component: ConfigPage, icon: 'cog' },
      { title: 'About', component: AboutPage, icon: 'information-circle' },
    ];
  }

  openPage(page) {
      this.storage.get('name').then((val) => {
        console.log('Your name is', val);
      });
    // close the menu when clicking a link from the menu
    this.menu.close();
    // TODO: check this behaviour, not always shows spinner
    /*
    this.loading = this.load.create({
          spinner: 'bubbles',
          content: 'Loading ...',
          duration: 3000,
          dismissOnPageChange: true,
          showBackdrop: true
        });

    this.loading.present();
    */
    // navigate to the new page if it is not the current page
    this.nav.setRoot(page.component,{
      list: page.title
    });
  }

  pushPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // rootNav is now deprecated (since beta 11) (https://forum.ionicframework.com/t/cant-access-rootnav-after-upgrade-to-beta-11/59889)
    this.app.getRootNav().push(page.component);
  }
}
