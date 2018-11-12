import { Component, ViewChild } from '@angular/core';
import { AdMobFree, AdMobFreeBannerConfig } from '@ionic-native/admob-free';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Storage } from '@ionic/storage';
import firebase from 'firebase';
import { FCM } from '@ionic-native/fcm';
import { App, MenuController, Nav, Platform } from 'ionic-angular';

import { AboutPage } from '../pages/about-page/about-page';
import { BackupPage } from '../pages/backup-page/backup-page';
import { CategorysPage } from '../pages/categorys-page/categorys-page';
import { ConfigPage } from '../pages/config-page/config-page';
import { DashboardPage } from '../pages/dashboard-page/dashboard-page';
import { ItemsPage } from '../pages/items-page/items-page';
import { ListPage } from '../pages/list-page/list-page';
import { ListsPage } from '../pages/lists-page/lists-page';
import { GlobalVars } from '../providers/global-vars/global-vars';
import { Log } from '../providers/log/log';
import { TranslateService } from '@ngx-translate/core';

declare var cordova: any;

@Component({
  selector: 'app-root',
  templateUrl: 'app.html'
})
export class Alacena {
  @ViewChild(Nav) nav: Nav;

  rootPage = DashboardPage;

  pages: Array<{ title: string; icon: string; component: any }>;

  constructor(
    platform: Platform,
    public menu: MenuController,
    public app: App,
    public splashScreen: SplashScreen,
    public statusBar: StatusBar,
    private storage: Storage,
    public fcm: FCM,
    private admobFree: AdMobFree,
    public globalVars: GlobalVars,
    public log: Log,
    private translateService: TranslateService
  ) {
    this.log.setLogger(this.constructor.name);

    this.translateService.setDefaultLang('es');
    this.translateService.use('es');

    this.globalVars.getConfigData().then(data => {
      let version: boolean = (<any>data).version;
      if (!version) {
        this.log.logs[this.constructor.name].info(
          'Getting Data from previous version'
        );
        this.globalVars.getOldData();
      }
    });
    //Firebase configuration
    firebase.initializeApp({
      // TEST: "REVERSED_CLIENT_ID": "com.googleusercontent.apps.354280052179-amrn5f7si36l9lsdinjf8u7q5a5thpri"
      //apiKey: 'AIzaSyD_NlhDQlkGPnjyDhVrphHkRLnDH30WvqM', //Firebase production?
      apiKey: 'AIzaSyCq_XZBezFcC_iAWa-i12swT0YL9sqvjfM', //Firebase
      //apiKey: "AIzaSyCYbNChWjDtLYXkm_ayPQeb4t4TjWDXWd0",//GoogleDevConsole
      authDomain: 'alacena-58699.firebaseapp.com',
      databaseURL: 'https://alacena-58699.firebaseio.com',
      projectId: 'alacena-58699',
      storageBucket: 'alacena-58699.appspot.com',
      messagingSenderId: '354280052179'
    });

    platform.ready().then(() => {
      //Initial platform configuration
      this.splashScreen.hide();
      this.statusBar.hide();
      /*
        platforms: {
          ios: {
            statusbarPadding: true
          }
        }
      */
      //this.statusBar.overlaysWebView(false);
      //Admob Configuration
      let adMobId = 'ca-app-pub-7863580056712493~5233178966';
      if (platform.is('android')) {
        // for android
        adMobId = 'ca-app-pub-7863580056712493~5233178966';
      } else if (platform.is('ios')) {
        // for ios
        adMobId = 'ca-app-pub-7863580056712493~8186645366';
      }
      //Show admob banner
      const bannerConfig: AdMobFreeBannerConfig = {
        id: adMobId,
        isTesting: true, //remove for production
        autoShow: true,
        overlap: false,
        size: 'LARGE_BANNER',
        bannerAtTop: false
      };
      this.admobFree.banner.config(bannerConfig);
      this.admobFree.banner
        .prepare()
        .then(() => {
          this.log.logs[this.constructor.name].info('Showing AddMob banner');
          this.admobFree.banner.show();
        })
        .catch(e => this.log.logs[this.constructor.name].error(e));

      fcm.onNotification().subscribe(data => {
        if (data.wasTapped) {
          this.log.logs[this.constructor.name].info('Tapped Notification');
          //TODO: send to the List relative to the notification
          //Notification was received on device tray and tapped by the user.
          //this.navCtrl.setRoot('DetailPage', { profileId: data.profileId });
        } else {
          this.log.logs[this.constructor.name].info('Foreground Notification');
          //TODO: send to the List relative to the notification
          //Notification was received in foreground. Maybe the user needs to be notified.
          //this.navCtrl.push('DetailPage', { profileId: data.profileId });
        }
      });
    });
    //List of pages for side menu
    this.pages = [
      { title: 'Inicio', component: DashboardPage, icon: 'contact' },
      { title: 'LISTA_COMPRA', component: ListPage, icon: 'basket' },
      { title: 'Lists', component: ListsPage, icon: 'list-box' },
      { title: 'Items', component: ItemsPage, icon: 'list' },
      { title: 'Categories', component: CategorysPage, icon: 'paper' },
      { title: 'Config', component: ConfigPage, icon: 'cog' },
      { title: 'Backup', component: BackupPage, icon: 'disc' },
      { title: 'About', component: AboutPage, icon: 'information-circle' }
    ];
  }
  /**
   * Open a page from side menu
   *
   * @param {any} page Object with the page information
   * @memberof Alacena
   */
  openPage(page) {
    this.log.logs[this.constructor.name].info('Moving to:' + page.title);
    this.menu.close();
    this.nav.setRoot(page.component, {
      list: page.title
    });
  }
}
