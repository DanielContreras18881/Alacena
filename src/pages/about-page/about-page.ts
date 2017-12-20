import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  submitAttempt: boolean = false;
  contactForm: FormGroup;

  constructor(
    public navCtrl: NavController,
    private appVersion: AppVersion,
    public plt: Platform,
    public formBuilder: FormBuilder
  ) {
    this.contactForm = formBuilder.group({
      name: [
        '',
        Validators.compose([
          Validators.maxLength(30),
          Validators.pattern('[a-zA-Z ]*'),
          Validators.required
        ])
      ],
      email: [
        '',
        Validators.compose([
          Validators.pattern(
            "[a-z0-9!#$%&'*+/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*"
          ),
          Validators.required
        ])
      ],
      copy: [false, Validators.compose([Validators.required])],
      message: ['', Validators.compose([Validators.required])]
    });
  }

  save() {
    this.submitAttempt = true;

    if (!this.contactForm.valid) {
      console.log('error!');
    } else {
      console.log('success!');
      console.log(this.contactForm.value);
    }
  }

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
