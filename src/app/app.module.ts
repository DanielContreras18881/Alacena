import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { AdMobFree } from '@ionic-native/admob-free';
import { GooglePlus } from '@ionic-native/google-plus';
import { Network } from '@ionic-native/network';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage';
import { IonicApp, IonicModule } from 'ionic-angular';
import { AutoCompleteModule } from 'ionic2-auto-complete';

import { BottomButtonsComponent } from '../components/bottom-buttons-component/bottom-buttons-component';
import { Item } from '../components/item-data/item-data';
import { PopoverPage } from '../components/popover/popover';
import { AboutPage } from '../pages/about/about';
import { CategoriesPage } from '../pages/categories/categories';
import { ListIconsPage } from '../pages/categories/list-icons';
import { CategoryInfoPage } from '../pages/category-info/category-info';
import { ConfigPage } from '../pages/config/config';
import { GettingStartedPage } from '../pages/getting-started/getting-started';
import { ItemInfoPage } from '../pages/item-info/item-info';
import { ItemsPage } from '../pages/items/items';
import { ListPage } from '../pages/list/list';
import { ListsPage } from '../pages/lists/lists';
import { AuthService } from '../providers/auth/auth.service';
import { CategoriesService } from '../providers/categories/categoriesService';
import { CategoriesData } from '../providers/data/categories-data';
import { CloudStorage } from '../providers/data/cloudStorage';
import { ConfigData } from '../providers/data/config-data';
import { ItemData } from '../providers/data/item-data';
import { ListData } from '../providers/data/list-data';
import { ListsData } from '../providers/data/lists-data';
import { LocalStorage } from '../providers/data/localStorage';
import { DefaultIcons } from '../providers/default-icons/default-icons';
import { GlobalVars } from '../providers/global-vars/global-vars';
import { Alacena } from './app.component';

@NgModule({
  declarations: [
    Alacena,
    GettingStartedPage,
    ListPage,
    ListsPage,
    ItemsPage,
    ItemInfoPage,
    ConfigPage,
    AboutPage,
    CategoriesPage,
    Item,
    BottomButtonsComponent,
    PopoverPage,
    ListIconsPage,
    CategoryInfoPage
  ],
  imports: [
    AutoCompleteModule,
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(Alacena),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    Alacena,
    GettingStartedPage,
    ListPage,
    ListsPage,
    ItemsPage,
    ItemInfoPage,
    ConfigPage,
    AboutPage,
    CategoriesPage,
    Item,
    BottomButtonsComponent,
    PopoverPage,
    ListIconsPage,
    CategoryInfoPage
  ],
  providers: [
    //{provide: ErrorHandler, useClass: SentryErrorHandler},
    AdMobFree,
    GooglePlus,
    Network,
    CloudStorage,
    LocalStorage,
    CategoriesService,
    DefaultIcons,
    CategoriesData,
    ListsData,
    ListData,
    ItemData,
    ItemInfoPage,
    ConfigData,
    SplashScreen,
    StatusBar,
    GlobalVars,
    AuthService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
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
