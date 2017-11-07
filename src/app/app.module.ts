import { RemindersComponent } from '../components/reminders-component/reminders-component';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
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
import { AppVersion } from '@ionic-native/app-version';
import { Camera } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';

import { PhonegapLocalNotification } from '@ionic-native/phonegap-local-notification';

import { BottomButtonsComponent } from '../components/bottom-buttons-component/bottom-buttons-component';
import { Item } from '../components/item-data/item-data';
import { AboutPage } from '../pages/about-page/about-page';
import { BackupPage } from '../pages/backup-page/backup-page';
import { CategorysPage } from '../pages/categorys-page/categorys-page';
import { ListIconsPage } from '../components/icons/list-icons';
import { CategoryInfoPage } from '../components/category-info/category-info';
import { ConfigPage } from '../pages/config-page/config-page';
import { DashboardPage } from '../pages/dashboard-page/dashboard-page';
import { ItemInfoPage } from '../components/item-info/item-info';
import { ItemsPage } from '../pages/items-page/items-page';
import { ListPage } from '../pages/list-page/list-page';
import { ListsPage } from '../pages/lists-page/lists-page';
import { AuthService } from '../providers/auth/auth.service';
import { CategoriesService } from '../providers/categories/categoriesService';
import { CategorysProvider } from '../providers/categorys-provider';
import { CloudStorage } from '../providers/data/cloudStorage';
import { ConfigProvider } from '../providers/config-provider';
import { ItemsProvider } from '../providers/items-provider';
import { ListProvider } from '../providers/list-provider';
import { ListsProvider } from '../providers/lists-provider';
import { RemindersProvider } from '../providers/reminders-provider';
import { LocalStorage } from '../providers/data/localStorage';
import { DefaultIcons } from '../providers/default-icons/default-icons';
import { GlobalVars } from '../providers/global-vars/global-vars';
import { Alacena } from './app.component';

@NgModule({
  declarations: [
    Alacena,
    DashboardPage,
    ListPage,
    ListsPage,
    ItemsPage,
    ItemInfoPage,
    ConfigPage,
    AboutPage,
    BackupPage,
    CategorysPage,
    Item,
    BottomButtonsComponent,
    ListIconsPage,
    CategoryInfoPage,
    RemindersComponent
  ],
  imports: [
    AutoCompleteModule,
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(Alacena, {
      backButtonText: '',
      modalEnter: 'modal-slide-in',
      modalLeave: 'modal-slide-out',
      spinner: 'bubbles',
      loadingEnter: 'slide-in',
      loadingLEave: 'slide-out',
      pageTransition: 'slide'
    }),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    Alacena,
    DashboardPage,
    ListPage,
    ListsPage,
    ItemsPage,
    ItemInfoPage,
    ConfigPage,
    AboutPage,
    BackupPage,
    CategorysPage,
    Item,
    BottomButtonsComponent,
    ListIconsPage,
    CategoryInfoPage,
    RemindersComponent
  ],
  providers: [
    //{provide: ErrorHandler, useClass: SentryErrorHandler},
    AdMobFree,
    AppVersion,
    Camera,
    ImagePicker,
    GooglePlus,
    Network,
    CloudStorage,
    LocalStorage,
    CategoriesService,
    DefaultIcons,
    CategorysProvider,
    ListsProvider,
    ListProvider,
    ItemsProvider,
    RemindersProvider,
    ItemInfoPage,
    ConfigProvider,
    PhonegapLocalNotification,
    SplashScreen,
    StatusBar,
    GlobalVars,
    AuthService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
