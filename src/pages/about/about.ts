import { Component } from '@angular/core';
import { AppVersion } from '@ionic-native/app-version';
import { NavController } from 'ionic-angular';
import { Platform } from 'ionic-angular';

/*
  Generated class for the AboutPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/

// TODO: get data from device and manage tutorials

@Component({
  templateUrl: 'about.html'
})
export class AboutPage {
  version: string = '';
  constructor(
    public nav: NavController,
    private appVersion: AppVersion,
    public plt: Platform
  ) {
    if (plt.is('android') || plt.is('ios')) {
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
}
