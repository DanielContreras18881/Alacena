import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { Alacena } from './app.component';

import {ConfigData} from '../providers/data/config-data';
import {ItemData} from '../providers/data/item-data';
import {ListData} from '../providers/data/list-data';
import {ListsData} from '../providers/data/lists-data';
import {CategoriesData} from '../providers/data/categories-data';
import {DefaultIcons} from '../providers/default-icons/default-icons';

import {GlobalVars} from '../providers/global-vars/global-vars';
import {CategoriesService} from '../providers/categories/categoriesService';

import {GettingStartedPage} from '../pages/getting-started/getting-started';
import {ListPage} from '../pages/list/list';
import {ListsPage} from '../pages/lists/lists';
import {ItemsPage} from '../pages/items/items';
import {ConfigPage} from '../pages/config/config';
import {AboutPage} from '../pages/about/about';
import {CategoriesPage} from '../pages/categories/categories';

@NgModule({
  declarations: [
    Alacena,
    GettingStartedPage,
    ListPage,
    ListsPage,
    ItemsPage,
    ConfigPage,
    AboutPage,
    CategoriesPage,
  ],
  imports: [
    IonicModule.forRoot(Alacena)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    Alacena,
    GettingStartedPage,
    ListPage,
    ListsPage,
    ItemsPage,
    ConfigPage,
    AboutPage,
    CategoriesPage,
  ],
  providers: [CategoriesService, GlobalVars, DefaultIcons, CategoriesData, ListsData, ListData, ItemData, ConfigData],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule {}
// TODO: check and configure general iomic app settings
//@App({
//  templateUrl: 'build/app.html',
//  providers: [GlobalVars, ConfigData, ItemData, ListData, ListsData],
//  config: { // http://ionicframework.com/docs/v2/api/config/Config/
//    backButtonText: '',
//    spinner: 'bubbles',
//    modalEnter: 'modal-slide-in',
//    modalLeave: 'modal-slide-out',
//    loadingEnter: 'slide-in',
//    loadingLEave: 'slide-out',
//    pageTransition: 'slide'
//  }
//})
