import { FCM } from '@ionic-native/fcm';
import { ItemsNeededComponent } from '../../components/items-needed-component/items-needed-component';
import { PhonegapLocalNotification } from '@ionic-native/phonegap-local-notification';
import { LocalNotifications, ILocalNotification } from '@ionic-native/local-notifications';
import { TranslateService } from '@ngx-translate/core';

import { Reminder } from '../../classes/reminder';
import { RemindersProvider } from '../../providers/reminders-provider';
import {
  IonicPage,
  ModalController,
  AlertController,
  ToastController,
  NavController,
  Platform
} from 'ionic-angular';
import { AuthService } from '../../providers/auth/auth.service';
import { Component, NgZone } from '@angular/core';

import { Pipe, PipeTransform } from '@angular/core';

import { GooglePlus } from '@ionic-native/google-plus';
import firebase from 'firebase';

import moment from 'moment';

import { RemindersComponent } from '../../components/reminders-component/reminders-component';
import { ItemsBestBeforeComponent } from '../../components/items-best-before-component/items-best-before-component';

import { ListPage } from '../list-page/list-page';
import { OrderBy } from '../../pipes/orderBy';
import { GlobalVars } from '../../providers/global-vars/global-vars';

import { Log } from '../../providers/log/log';

declare var gapi: any;
declare var self: any;
declare var cordova: any;
/**
 * Page to show initial data and manage login
 *
 * @export
 * @class DashboardPage
 */
@IonicPage()
@Component({
  selector: 'page-dashboard-page',
  templateUrl: 'dashboard-page.html',
  providers: [OrderBy]
})
export class DashboardPage {
  shoppingListPage = {
    title: 'LISTA_COMPRA',
    component: ListPage,
    icon: 'basket'
  };
  userAccount: boolean = true;
  expires: boolean = true;
  reminders: boolean = false;

  remindersList: Reminder[] = [];

  userProfile: any = null;
  zone: NgZone;

  native:boolean = false;

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    private toastCtrl: ToastController,
    public plt: Platform,
    public fcm: FCM,
    private order: OrderBy,
    private googlePlus: GooglePlus,
    private globalVars: GlobalVars,
    private authService: AuthService,
    private remindersData: RemindersProvider,
    private localNotification: PhonegapLocalNotification,
    private localNotifications: LocalNotifications,
    public mod: ModalController,
    public log: Log,
    public translate: TranslateService
  ) {
    this.log.setLogger(this.constructor.name);
  }
  public recaptchaVerifier: firebase.auth.RecaptchaVerifier;

  ionViewDidLoad() {
    this.log.logs[this.constructor.name].info('ionViewDidLoad');
    if ((this.plt.is('android') || this.plt.is('ios')) && !this.plt.is('mobileweb')) {
      this.native = true;
    }

    this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      'recaptcha-container'
    );

    this.zone = new NgZone({});
    self = this;
    firebase.auth().onAuthStateChanged(user => {
      // if login state changed
      this.zone.run(() => {
        if (user) {
          this.userProfile = user;
          this.fcm
            .getToken()
            .then(token => {
              this.log.logs[this.constructor.name].info('Getting FCM token');
              // Your best bet is to here store the token on the user's profile on the
              // Firebase database, so that when you want to send notifications to this
              // specific user you can do it from Cloud Functions.
              self.globalVars.setUserProfile(user, token).then(() => {
                this.getDashboardData();
              });
            })
            .catch(e => this.log.logs[this.constructor.name].error(e));
        } else {
          this.userProfile = null;
          this.getDashboardData();
        }
      });
    });
  }

  getNotificationToken() {}
  /**
   * Get data to show on dashboard
   *
   * @memberof DashboardPage
   */
  getDashboardData() {
    this.log.logs[this.constructor.name].info('getDashboardData');
    this.remindersData.getReminders().then(data => {
      this.remindersList = <Reminder[]>data;
      if (this.remindersList.length > 0) {
        this.reminders = true;
      }
    });
  }
  /**
   * Open a page of the app
   *
   * @param {any} page
   * @memberof DashboardPage
   */
  openInternalPage(page) {
    this.navCtrl.push(page.component, {
      list: page.title
    });
  }
  /**
   * Show items needed to shop
   *
   * @memberof DashboardPage
   */
  showItemsToShop() {
    let toShopModal = this.mod.create(ItemsNeededComponent);
    toShopModal.present();
  }
  /**
   * Show list of items near to expire
   *
   * @memberof DashboardPage
   */
  showExpireItems() {
    let expiresModal = this.mod.create(ItemsBestBeforeComponent);
    expiresModal.present();
  }
  /**
   * Edit a reminder
   *
   * @memberof DashboardPage
   */
  editReminder(data: Reminder) {
    this.log.logs[this.constructor.name].info('editReminder');
    let oldReminder = JSON.parse(JSON.stringify(data));
    let reminderModal = this.mod.create(RemindersComponent, data);
    reminderModal.onDidDismiss(data => {
      if (data) {
        this.localNotification.requestPermission().then(permission => {
          if (permission === 'granted') {
            let reminder: Reminder = {
              message: data.message,
              time: moment(data.notificationDate).toISOString()
            };
            this.remindersData.setReminder(reminder);
            this.remindersList.push(reminder);
            this.remindersList = this.remindersList.filter(
              item =>
                item.message !== oldReminder.message ||
                item.time !== oldReminder.time
            );
            if(this.native){
              this.localNotifications.schedule(<ILocalNotification>{
                id: moment(data.notificationDate).unix(),
                text: data.message,
                at: moment(data.notificationDate).toDate()
              });
            } else {
              const timeOutHandler = setTimeout(
                ()=>{
                  alert(data.message);
                  this.remindersData.removeReminder(data);
                },
                moment(data.notificationDate).subtract(moment(new Date().toISOString()).add(1,'hour').valueOf(),'milliseconds').valueOf()
              );
            }
          }
        });
      }
    });
    reminderModal.present();
    this.remindersData.removeReminder(oldReminder);
  }
  /**
   * Loggin by phone number
   *
   * @memberof DashboardPage
   */
  phoneLogin() {
    this.log.logs[this.constructor.name].info('phoneLogin');
    this.translate.get(
      [
        'InsertarTelefono',
        'IncluirCodigoRegion',
        'Cancelar',
        'ValidValue',
        'Login',
        'CodigoConfirmacion',
        'IntroducirCodigoConfirmacion',
        'Enviar'
      ])
        .subscribe(
          values => {
            this.alertCtrl
              .create({
                title: values['InsertaTelefono'],
                subTitle: values['IncluirCodigoRegion'],
                inputs: [
                  {
                    name: 'phoneNumber',
                    placeholder: '+ xx xxx xxx xxx'
                  }
                ],
                buttons: [
                  {
                    text: values['Cancelar'],
                    role: 'cancel'
                  },
                  {
                    text: values['Login'],
                    handler: data => {
                      if (data.phoneNumber.trim() == '' || data.phoneNumber == null) {
                        const toast = this.toastCtrl.create({
                          message: values['ValidValue'],
                          duration: 1500,
                          position: 'bottom'
                        });
                        toast.present();
                        return;
                      }
                      this.authService
                        .phoneLogin(data.phoneNumber.trim())
                        .then(result => {
                          let prompt = this.alertCtrl.create({
                            title: values['IntroducirCodigoConfirmacion'],
                            inputs: [
                              {
                                name: 'confirmationCode',
                                placeholder: values['CodigoConfirmacion']
                              }
                            ],
                            buttons: [
                              {
                                text: values['Cancelar'],
                                handler: data => {
                                  this.log.logs[this.constructor.name].error(
                                    'Cancel clicked'
                                  );
                                }
                              },
                              {
                                text: values['Enviar'],
                                handler: data => {
                                  (<any>result)
                                    .confirm(data.confirmationCode)
                                    .then(function(result) {
                                      // User signed in successfully.
                                      this.log.logs[this.constructor.name].info(
                                        'Send:' + result.user
                                      );
                                      // ...
                                    })
                                    .catch(function(error) {
                                      this.log.logs[this.constructor.name].error(
                                        'SendError:' + error
                                      );
                                      // User couldn't sign in (bad verification code?)
                                      // ...
                                    });
                                }
                              }
                            ]
                          });
                          prompt.present();
                        });
                    }
                  }
                ]
              })
              .present();
          }
      );
  }
  /**
   * Login by facebook
   *
   * @memberof DashboardPage
   */
  facebookLogin() {
    this.authService.facebookLogin().then(data => {
      this.log.logs[this.constructor.name].info('facebook:' + data);
    });
  }
  /**
   * Login by google
   *
   * @memberof DashboardPage
   */
  googleLogin() {
    this.authService.googleAuth().then(data => {
      this.log.logs[this.constructor.name].info('google:' + data);
    });
  }
  /**
   * Login by twitter
   *
   * @memberof DashboardPage
   */
  twitterLogin() {
    this.authService.twitterLogin().then(data => {
      this.log.logs[this.constructor.name].info('twitter:' + data);
    });
  }
  /**
   * Logout
   *
   * @memberof DashboardPage
   */
  logout() {
    this.log.logs[this.constructor.name].info('logout');
    this.authService.logout().then(data => {
      this.userProfile = null;
      this.ionViewDidLoad();
    });
  }
}
