import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { AppVersion } from '@ionic-native/app-version';
import { Platform } from 'ionic-angular';
import { Http } from '@angular/http';
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
  messageRows: number = 10;

  constructor(
    public navCtrl: NavController,
    private appVersion: AppVersion,
    public plt: Platform,
    public formBuilder: FormBuilder,
    public http: Http,
    private toastCtrl: ToastController
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
          )
        ])
      ],
      message: ['', Validators.compose([Validators.required])]
    });
  }

  save() {
    if (this.contactForm.valid) {
      this.http
        .post(
          //'https://us-central1-alacena-58699.cloudfunctions.net/mail',
          'http://localhost:5000/alacena-58699/us-central1/mail',
          JSON.stringify(this.contactForm.value)
        )
        .subscribe(data => {
          if (data.status === 200) {
            const toast = this.toastCtrl.create({
              message: data['_body'],
              duration: 1000,
              position: 'bottom'
            });
            toast.present();
          } else {
            const toast = this.toastCtrl.create({
              message: `${data['_body']}, try again later`,
              duration: 1000,
              position: 'bottom'
            });
            toast.present();
          }
        });
    } else {
      this.submitAttempt = true;
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
