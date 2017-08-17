import { ItemInfoPage } from "../pages/item-info/item-info";
import { AuthService } from "../providers/auth/auth.service";
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, ErrorHandler } from "@angular/core";
import { IonicApp, IonicModule } from "ionic-angular";
import { BrowserModule } from "@angular/platform-browser";
import { Alacena } from "./app.component";
import { HttpModule } from "@angular/http";
import { SplashScreen } from "@ionic-native/splash-screen";
import { StatusBar } from "@ionic-native/status-bar";
import { IonicStorageModule } from "@ionic/storage";
import { Network } from "@ionic-native/network";
import { GooglePlus } from "@ionic-native/google-plus";
import { AdMobFree } from "@ionic-native/admob-free";

import { SentryErrorHandler } from "../services/sentry-errorhandler";

import { ConfigData } from "../providers/data/config-data";
import { ItemData } from "../providers/data/item-data";
import { ListData } from "../providers/data/list-data";
import { ListsData } from "../providers/data/lists-data";
import { CategoriesData } from "../providers/data/categories-data";
import { DefaultIcons } from "../providers/default-icons/default-icons";
import { CloudStorage } from "../providers/data/cloudStorage";
import { LocalStorage } from "../providers/data/localStorage";

import { GlobalVars } from "../providers/global-vars/global-vars";
import { CategoriesService } from "../providers/categories/categoriesService";

import { GettingStartedPage } from "../pages/getting-started/getting-started";
import { ListPage } from "../pages/list/list";
import { ListsPage } from "../pages/lists/lists";
import { ItemsPage } from "../pages/items/items";
import { ConfigPage } from "../pages/config/config";
import { AboutPage } from "../pages/about/about";
import { CategoriesPage } from "../pages/categories/categories";

import { Item } from "../components/item-data/item-data";
import { BottomButtonsComponent } from "../components/bottom-buttons-component/bottom-buttons-component";
import { PopoverPage } from "../components/popover/popover";

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
    PopoverPage
  ],
  imports: [
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
    PopoverPage
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
