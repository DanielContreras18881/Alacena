import { Component, ViewChild } from '@angular/core';
import { AdMobFree, AdMobFreeBannerConfig } from '@ionic-native/admob-free';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Storage } from '@ionic/storage';
import firebase from 'firebase';
import { App, MenuController, Nav, Platform } from 'ionic-angular';

import { AboutPage } from '../pages/about/about';
import { CategoriesPage } from '../pages/categories/categories';
import { ConfigPage } from '../pages/config/config';
import { GettingStartedPage } from '../pages/getting-started/getting-started';
import { ItemsPage } from '../pages/items/items';
import { ListPage } from '../pages/list/list';
import { ListsPage } from '../pages/lists/lists';
import { GlobalVars } from '../providers/global-vars/global-vars';

declare var cordova: any;

@Component({
  selector: 'app-root',
  templateUrl: 'app.html'
})
export class Alacena {
  @ViewChild(Nav) nav: Nav;

  userProfile: any = null;

  rootPage = GettingStartedPage;
  //rootPage = ListPage;
  //rootPage = ListsPage;
  //rootPage = ConfigPage;
  //rootPage = CategoriesPage;

  pages: Array<{ title: string; icon: string; component: any }>;

  constructor(
    platform: Platform,
    public menu: MenuController,
    public app: App,
    public splashScreen: SplashScreen,
    public statusBar: StatusBar,
    private storage: Storage,
    private admobFree: AdMobFree,
    private globalVars: GlobalVars
  ) {
    this.globalVars.getConfigData().then(data => {
      let version: boolean = (<any>data).version;
      if (!version) {
        this.storage.set('cantidadElementosLista', [
          {
            nombreElemento: 'Panecillos',
            nombreLista: 'LISTA_COMPRA',
            cantidadElemento: 2,
            colorElemento: 'item item-calm item-complex item-right-editable',
            colorBotones: 'button-calm',
            colorElementoNoCaducado:
              'item item-calm item-complex item-right-editable',
            colorBotonesNoCaducado: 'button-calm',
            caduca: true,
            fechaCaducidad: '2015-09-29',
            cantidadMinima: 1,
            marked: false
          },
          {
            nombreElemento: 'Cervezas',
            nombreLista: 'LISTA_COMPRA',
            cantidadElemento: 3,
            colorElemento:
              'item item-balanced item-complex item-right-editable',
            colorBotones: 'button-balanced',
            colorElementoNoCaducado:
              'item item-balanced item-complex item-right-editable',
            colorBotonesNoCaducado: 'button-balanced',
            caduca: true,
            fechaCaducidad: '2016-05-18',
            cantidadMinima: 2,
            marked: false
          },
          {
            nombreElemento: 'Papel de cocina',
            nombreLista: 'LISTA_COMPRA',
            cantidadElemento: 5,
            colorElemento: 'item item-stable item-complex item-right-editable',
            colorBotones: 'button-stable',
            colorElementoNoCaducado:
              'item item-stable item-complex item-right-editable',
            colorBotonesNoCaducado: 'button-stable',
            caduca: false,
            fechaCaducidad: null,
            cantidadMinima: 3,
            marked: false
          }
        ]);

        console.log('noexiste version');
        //TODO : recuperar datos de version anterior, si existen, y cargarlos en localstorage
        this.globalVars.getOldData().then(data => {
          console.log(data);
        });
      }
      // TODO : Se necesita hacer algo generico?
    });

    firebase.initializeApp({
      apiKey: 'AIzaSyCq_XZBezFcC_iAWa-i12swT0YL9sqvjfM', //Firebase
      //apiKey: "AIzaSyCYbNChWjDtLYXkm_ayPQeb4t4TjWDXWd0",//GoogleDevConsole
      authDomain: 'alacena-58699.firebaseapp.com',
      databaseURL: 'https://alacena-58699.firebaseio.com',
      projectId: 'alacena-58699',
      storageBucket: 'alacena-58699.appspot.com',
      messagingSenderId: '354280052179'
    });

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.splashScreen.hide();
      this.statusBar.styleBlackTranslucent();
      this.statusBar.backgroundColorByHexString('#222');
      this.statusBar.overlaysWebView(true);

      let adMobId = 'ca-app-pub-7863580056712493/6709912168';
      if (platform.is('android')) {
        // for android
        adMobId = 'ca-app-pub-7863580056712493/6709912168';
      } else if (platform.is('ios')) {
        // for ios
        adMobId = 'ca-app-pub-7863580056712493/9663378563';
      }
      console.log('app:run:AdMob Banner inicializado');
      console.log('app:run:' + adMobId);
      const bannerConfig: AdMobFreeBannerConfig = {
        // add your config here
        // for the sake of this example we will just use the test config
        id: adMobId,
        isTesting: true,
        autoShow: true,
        overlap: false
      };
      this.admobFree.banner.config(bannerConfig);
      this.admobFree.banner
        .prepare()
        .then(() => {
          // banner Ad is ready
          // if we set autoShow to false, then we will need to call the show method here
          this.admobFree.banner.show();
        })
        .catch(e => console.log(e));
    });

    //loading: any;

    this.pages = [
      { title: 'Inicio', component: GettingStartedPage, icon: 'contact' },
      { title: 'LISTA_COMPRA', component: ListPage, icon: 'basket' },
      { title: 'Lists', component: ListsPage, icon: 'list-box' },
      { title: 'Items', component: ItemsPage, icon: 'list' },
      { title: 'Categories', component: CategoriesPage, icon: 'paper' },
      { title: 'Config', component: ConfigPage, icon: 'cog' },
      { title: 'About', component: AboutPage, icon: 'information-circle' }
    ];
  }

  openPage(page) {
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
    this.nav.setRoot(page.component, {
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
