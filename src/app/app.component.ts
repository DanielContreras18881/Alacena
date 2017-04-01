import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, Nav, App,
//  LoadingController
} from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import {GettingStartedPage} from '../pages/getting-started/getting-started';
import {ListPage} from '../pages/list/list';
import {ListsPage} from '../pages/lists/lists';
import {ItemsPage} from '../pages/items/items';
import {ConfigPage} from '../pages/config/config';
import {AboutPage} from '../pages/about/about';
import {CategoriesPage} from '../pages/categories/categories';

import {ConfigData} from '../providers/data/config-data';
import {ItemData} from '../providers/data/item-data';
import {ListData} from '../providers/data/list-data';
import {ListsData} from '../providers/data/lists-data';
import {CategoriesData} from '../providers/data/categories-data';
import {DefaultIcons} from '../providers/default-icons/default-icons';
import {GlobalVars} from '../providers/global-vars/global-vars';


@Component({
  selector: 'app-root',
  templateUrl: 'app.html'
})
export class Alacena {

  @ViewChild(Nav) nav: Nav;

  rootPage = GettingStartedPage;
  // rootPage: any = ListsPage;
  // rootPage: any = ConfigPage;
  // rootPage: any = ItemsPage;
  // rootPage: any = CategoriesPage;

  pages: Array<{title: string, icon: string, component: any}>;
  pushPages: Array<{title: string, icon: string, component: any}>;

  constructor(
    platform: Platform,
    public menu: MenuController,
    public app: App,
    //private load: LoadingController,
    globalVars: GlobalVars,
    private config: ConfigData,
    private items: ItemData,
    private list: ListData,
    private lists: ListsData,
    private categories: CategoriesData,
    private icons: DefaultIcons
  ) {

    config.getConfigData().then(data => {
      globalVars.setConfigData(data);
    });
    items.getItemsData().then(data => {
      globalVars.setItemsData(data);
    });
    list.getListData().then(data => {
      globalVars.setListData(data);
    });
    lists.getListsData().then(data => {
      globalVars.setListsData(data);
    });
    categories.getCategoriesData().then(data => {
      globalVars.setCategoriesData(data);
    });
    icons.getIcons().then(data => {
      globalVars.setDefaultIconsData(data);
    });

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      Splashscreen.hide();
      StatusBar.styleDefault();
    });

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

    this.pushPages = [
      //{ title: 'Layouts', icon: 'grid', component: LayoutsPage },
      //{ title: 'Settings', icon: 'settings', component: SettingsPage }
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
