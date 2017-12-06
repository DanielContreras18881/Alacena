import { GlobalVars } from '../global-vars/global-vars';
import { Injectable } from '@angular/core';
import { NgZone } from '@angular/core';
import { GooglePlus } from '@ionic-native/google-plus';
import firebase from 'firebase';
import { Platform } from 'ionic-angular';

declare var gapi: any;
declare var self: any;
/**
 * Servie to manage login and logout on the cloud services for the app
 *
 * @export
 * @class AuthService
 */
@Injectable()
export class AuthService {
  userProfile: any = null;
  type: string = 'google';
  zone: NgZone;

  constructor(
    public plt: Platform,
    private googlePlus: GooglePlus,
    private globalVars: GlobalVars
  ) {
    this.zone = new NgZone({});
    self = this;
    firebase.auth().onAuthStateChanged(user => {
      this.zone.run(() => {
        if (user) {
          this.userProfile = user;
          self.globalVars.setUserProfile(user);
        } else {
          this.userProfile = null;
        }
      });
    });
  }
  /**
   * Logout of the user
   *
   * @param {string} type
   * @returns
   * @memberof AuthService
   */
  logout() {
    this.globalVars.disconnectUser();
    return new Promise(resolve => {
      self = this;
      switch (this.type) {
        case 'twitter':
          resolve('OK');
          break;
        case 'google':
          firebase.auth().signOut();
          this.userProfile = null;
          self.globalVars.setUserProfile(null);
          resolve('OK');
          break;
        case 'facebook':
          resolve('OK');
          break;
        case 'phone':
          firebase.auth().signOut();
          this.userProfile = null;
          self.globalVars.setUserProfile(null);
          resolve('OK');
          break;
      }
    });
  }
  /**
   * Login with twitter
   *
   * @returns
   * @memberof AuthService
   */
  twitterLogin() {
    //https://github.com/DanielContreras18881/ionic2-twitter-login
    //https://github.com/DanielContreras18881/ionic2-facebook-login
    this.type = 'twitter';
    return new Promise(resolve => {
      resolve('twitter');
    });
  }
  /**
   * Login with facebook
   *
   * @returns
   * @memberof AuthService
   */
  facebookLogin() {
    this.type = 'facebook';
    return new Promise(resolve => {
      resolve('facebook');
    });
  }
  /**
   * Login with phone number
   *
   * @returns
   * @memberof AuthService
   */
  phoneLogin(data: any) {
    //https://firebase.google.com/docs/auth/ios/phone-auth
    //https://firebase.google.com/docs/auth/android/phone-auth
    //https://javebratt.com/firebase-phone-authentication/
    //https://github.com/DanielContreras18881/firebase-phone-authentication
    this.type = 'phone';
    return new Promise(resolve => {
      let appVerifier = new firebase.auth.RecaptchaVerifier(
        'recaptcha-container',
        { size: 'invisible' }
      );
      firebase
        .auth()
        .signInWithPhoneNumber(data, appVerifier)
        .then(confirmationResult => {
          // SMS sent. Prompt user to type the code from the message, then sign the
          // user in with confirmationResult.confirm(code).
          resolve(confirmationResult);
        })
        .catch(function(error) {
          console.error('SMS not sent', error);
          appVerifier = null;
        });
    });
  }
  /**
   * Login with google
   *
   * @returns
   * @memberof AuthService
   */
  googleAuth() {
    this.type = 'google';
    return new Promise(resolve => {
      self = this;
      var provider = new firebase.auth.GoogleAuthProvider();
      var res = null;
      if (this.plt.is('ios') || this.plt.is('android')) {
        this.googlePlus
          .login({
            webClientId:
              '354280052179-fkmk7g20grbpkctmdgtt53oiel3be7a1.apps.googleusercontent.com',
            offline: true
          })
          .then(res => {
            firebase
              .auth()
              .signInWithCredential(
                firebase.auth.GoogleAuthProvider.credential(res.idToken)
              )
              .then(success => {
                this.userProfile = success.user;
                self.globalVars.setUserProfile(this.userProfile);
                resolve('google');
              })
              .catch(error =>
                resolve('Firebase failure: ' + JSON.stringify(error))
              );
          })
          .catch(err => resolve('Error: ' + JSON.stringify(err)));
      } else {
        firebase
          .auth()
          .signInWithRedirect(provider)
          .then(
            result => {
              this.userProfile = result.user;
              self.globalVars.setUserProfile(this.userProfile);
              resolve('google');
            },
            error => {
              resolve('Firebase failure: ' + JSON.stringify(error));
            }
          );
      }
    });
  }
}
