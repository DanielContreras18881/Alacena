import {
  CUSTOM_ELEMENTS_SCHEMA,
  NgModule,
  APP_INITIALIZER
} from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
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
import { File } from '@ionic-native/file';
import { FileMock } from '@ionic-native-mocks/file';

import { ConfigurationService } from 'ionic-configuration-service';
import { LoggingService } from 'ionic-logging-service';

import { PhonegapLocalNotification } from '@ionic-native/phonegap-local-notification';
import { LocalNotifications } from '@ionic-native/local-notifications';

import { RemindersComponent } from '../components/reminders-component/reminders-component';
import { ItemsBestBeforeComponent } from '../components/items-best-before-component/items-best-before-component';
import { ItemsNeededComponent } from '../components/items-needed-component/items-needed-component';
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
import { BackupData } from '../providers/backup-data/backup-data';
import { LocalStorage } from '../providers/data/localStorage';
import { DefaultIcons } from '../providers/default-icons/default-icons';
import { GlobalVars } from '../providers/global-vars/global-vars';
import { Log } from '../providers/log/log';
import { Alacena } from './app.component';

export function loadConfiguration(
  configurationService: ConfigurationService
): () => Promise<void> {
  return () => configurationService.load('assets/settings.json');
}

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
    RemindersComponent,
    ItemsBestBeforeComponent,
    ItemsNeededComponent
  ],
  imports: [
    AutoCompleteModule,
    BrowserModule,
    HttpModule,
    HttpClientModule,
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
    RemindersComponent,
    ItemsBestBeforeComponent,
    ItemsNeededComponent
  ],
  providers: [
    //{provide: ErrorHandler, useClass: SentryErrorHandler},
    //test and maybe change
    //{provide: ErrorHandler, useClass: IonicErrorHandler}
    ConfigurationService,
    {
      provide: APP_INITIALIZER,
      useFactory: loadConfiguration,
      deps: [ConfigurationService],
      multi: true
    },
    LoggingService,
    Log,
    AdMobFree,
    AppVersion,
    Camera,
    ImagePicker,
    //File,
    { provide: File, useClass: FileMock },
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
    BackupData,
    ItemInfoPage,
    ConfigProvider,
    PhonegapLocalNotification,
    LocalNotifications,
    SplashScreen,
    StatusBar,
    GlobalVars,
    AuthService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
