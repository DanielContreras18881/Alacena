import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { AppVersion } from '@ionic-native/app-version';
import { Platform } from 'ionic-angular';
/**
 * Page to show data about the author, the app, tutorials and a contact form
 * 
 * @export
 * @class AboutPage
 */
@IonicPage()
@Component({
  selector: 'page-about-page',
  templateUrl: 'about-page.html'
})
export class AboutPage {
  version: string = '';
  constructor(
    public navCtrl: NavController,
    private appVersion: AppVersion,
    public plt: Platform
  ) {}

  ionViewDidLoad() {
    if (this.plt.is('android') || this.plt.is('ios')) {
      this.appVersion.getVersionNumber().then(version => {
        this.version = version;
        this.appVersion.getVersionCode().then(code => {
          this.version += ' : ' + code;
        });
      });
    } else {
      this.version = 'browser';
    }
  }

  // TODO: manage tutorials, contact form with error logs
}
