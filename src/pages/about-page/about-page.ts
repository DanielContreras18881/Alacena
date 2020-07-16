import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { AppVersion } from '@ionic-native/app-version';
import { Platform } from 'ionic-angular';
import { Http } from '@angular/http';

import { TranslateService } from '@ngx-translate/core';

import { Log } from '../../providers/log/log';

/**
 * Page to show data about the author, the app, tutorials and a contact form
 *
 * @export
 * @class AboutPage
 */

@Component({
  selector: 'page-about-page',
  templateUrl: 'about-page.html'
})
export class AboutPage {
  version: string = '';
  submitAttempt: boolean = false;
  contactForm: FormGroup;
  messageRows: number = 10;

  constructor(
    public navCtrl: NavController,
    private appVersion: AppVersion,
    public plt: Platform,
    public formBuilder: FormBuilder,
    public http: Http,
    private toastCtrl: ToastController,
    public log: Log,
    public translate: TranslateService
  ) {
    this.log.setLogger(this.constructor.name);

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
          )
        ])
      ],
      message: ['', Validators.compose([Validators.required])],
      logs: ['']
    });
  }

  save() {
    this.contactForm
      .get('logs')
      .setValue(JSON.stringify(this.log.getLogMessages()));
    if (this.contactForm.valid) {
      this.http
        .post(
          'https://us-central1-alacena-58699.cloudfunctions.net/mail',
          //'http://localhost:5000/alacena-58699/us-central1/mail',
          JSON.stringify(this.contactForm.value)
        )
        .subscribe(data => {
          if (data.status === 200) {
            this.log.logs[this.constructor.name].info('Message sent');
            const toast = this.toastCtrl.create({
              message: data['_body'],
              duration: 1000,
              position: 'bottom'
            });
            toast.present();
          } else {
            this.log.logs[this.constructor.name].error('Message not sent');
            const toast = this.toastCtrl.create({
              message: `${data['_body']}, try again later`,
              duration: 1000,
              position: 'bottom'
            });
            toast.present();
          }
        });
    } else {
      this.log.logs[this.constructor.name].warn('Form not valid');
      this.submitAttempt = true;
    }
  }

  ionViewDidLoad() {
    if ((this.plt.is('android') || this.plt.is('ios')) && !this.plt.is('mobileweb')) {
      this.log.logs[this.constructor.name].info(
        'On Device:' + this.plt.platforms()
      );
      this.appVersion.getVersionNumber().then(version => {
        this.version = version;
        this.appVersion.getVersionCode().then(code => {
          this.version += ' : ' + code;
        });
      });
    } else {
      this.log.logs[this.constructor.name].info(
        'On Browser:' + this.plt.userAgent()
      );
      this.version = 'browser';
    }
  }

  // TODO: manage tutorials
}
