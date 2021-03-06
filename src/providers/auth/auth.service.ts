import { GlobalVars } from '../global-vars/global-vars';
import { Injectable } from '@angular/core';
import { NgZone } from '@angular/core';
import { GooglePlus } from '@ionic-native/google-plus';
//import { TwitterConnect } from '@ionic-native/twitter-connect';
//import { Facebook } from '@ionic-native/facebook';
import firebase from 'firebase';
import { Platform } from 'ionic-angular';

import { Log } from '../log/log';

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
  FB_APP_ID: number = 157863821611771;

  constructor(
    public plt: Platform,
    private googlePlus: GooglePlus,
    private globalVars: GlobalVars,
    public log: Log //private twitter: TwitterConnect, //public fb: Facebook
  ) {
    this.log.setLogger(this.constructor.name);
    //this.fb.browserInit(this.FB_APP_ID, 'v2.8');
    this.zone = new NgZone({});
    self = this;
    firebase.auth().onAuthStateChanged(user => {
      this.log.logs[this.constructor.name].info('user:' + user);
      this.zone.run(() => {
        if (user) {
          this.userProfile = user;
          self.globalVars.setUserProfile(user, null);
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
    this.log.logs[this.constructor.name].info('logout');
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
          self.globalVars.setUserProfile(null, null);
          resolve('OK');
          break;
        case 'facebook':
          resolve('OK');
          break;
        case 'phone':
          firebase.auth().signOut();
          this.userProfile = null;
          self.globalVars.setUserProfile(null, null);
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
    //https://ionicframework.com/docs/native/twitter-connect/
    //https://fabric.io/kits?show_signup=true
    //https://apps.twitter.com/app/14555731
    this.type = 'twitter';
    return new Promise(resolve => {
      /*
      this.twitter.login().then(
        response => {
          const twitterCredential = firebase.auth.TwitterAuthProvider.credential(
            response.token,
            response.secret
          );

          firebase
            .auth()
            .signInWithCredential(twitterCredential)
            .then(
              userProfile => {
                this.zone.run(() => {
                  this.userProfile = userProfile;
                  this.userProfile.twName = response.userName;
                  resolve(this.userProfile);
                });
              },
              error => {
                console.log(error);
              }
            );
        },
        error => {
          console.log('Error connecting to twitter: ', error);
        }
      );
      */
      resolve(this.type);
    });
  }
  /**
   * Login with facebook
   *
   * @returns
   * @memberof AuthService
   */
  facebookLogin() {
    /*
    IOS
    info.plist
<key>CFBundleURLTypes</key>
<array>
  <dict>
  <key>CFBundleURLSchemes</key>
  <array>
    <string>fb157863821611771</string>
  </array>
  </dict>
</array>
<key>FacebookAppID</key>
<string>157863821611771</string>
<key>FacebookDisplayName</key>
<string>Alacena</string>

<key>LSApplicationQueriesSchemes</key>
<array>
  <string>fbapi</string>
  <string>fb-messenger-api</string>
  <string>fbauth2</string>
  <string>fbshareextension</string>
</array>

AppDelegate.m

//  AppDelegate.m
#import <FBSDKCoreKit/FBSDKCoreKit.h>

- (BOOL)application:(UIApplication *)application
    didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {

  [[FBSDKApplicationDelegate sharedInstance] application:application
    didFinishLaunchingWithOptions:launchOptions];
  // Add any custom logic here.
  return YES;
}

- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url
    sourceApplication:(NSString *)sourceApplication annotation:(id)annotation {

  BOOL handled = [[FBSDKApplicationDelegate sharedInstance] application:application
    openURL:url
    sourceApplication:sourceApplication
    annotation:annotation
  ];
  // Add any custom logic here.
  return handled;
}


IOS10 o posterior

- (BOOL)application:(UIApplication *)application
            openURL:(NSURL *)url
            options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {

  BOOL handled = [[FBSDKApplicationDelegate sharedInstance] application:application
    openURL:url
    sourceApplication:options[UIApplicationOpenURLOptionsSourceApplicationKey]
    annotation:options[UIApplicationOpenURLOptionsAnnotationKey]
  ];
  // Add any custom logic here.
  return handled;


    */
    //https://github.com/javebratt/ionic2-firebase3-facebook-auth/blob/master/src/pages/home/home.ts
    //https://github.com/DanielContreras18881/ionic2-facebook-login/blob/master
    //https://ionicthemes.com/tutorials/about/ionic2-facebook-login
    //https://javebratt.com/ionic-2-facebook-login/157863821611771
    //https://developers.facebook.com/apps/157863821611771/settings/
    this.type = 'facebook';
    return new Promise(resolve => {
      let permissions = new Array<string>();
      let env = this;
      //the permissions your facebook app needs from the user
      permissions = ['public_profile'];
      /*
      this.fb.login(permissions).then(
        function(response) {
          let userId = response.authResponse.userID;
          let params = new Array<string>();

          //Getting name and gender properties
          env.fb.api('/me?fields=name,gender', params).then(function(user) {
            user.picture =
              'https://graph.facebook.com/' + userId + '/picture?type=large';
            resolve('facebook');
          });
        },
        function(error) {
          console.log(error);
        }
      );
      */
      resolve(this.type);
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
          this.log.logs[this.constructor.name].info('SMS sent');
          resolve(confirmationResult);
        })
        .catch(function(error) {
          this.log.logs[this.constructor.name].error(
            'SMS not sent:' + JSON.stringify(error)
          );
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
      if ((this.plt.is('android') || this.plt.is('ios')) && !this.plt.is('mobileweb')) {
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
                self.globalVars.setUserProfile(this.userProfile, null);
                this.log.logs[this.constructor.name].info(
                  'Google Login Success'
                );
                resolve('google');
              })
              .catch(error => {
                this.log.logs[this.constructor.name].error(
                  'Firebase failure: ' + JSON.stringify(error)
                );
                resolve('Firebase failure: ' + JSON.stringify(error));
              });
          })
          .catch(err => {
            this.log.logs[this.constructor.name].error(
              'Error: ' + JSON.stringify(err)
            );
            resolve('Error: ' + JSON.stringify(err));
          });
      } else {
        firebase
          .auth()
          .signInWithRedirect(provider)
          .then(
            result => {
              this.userProfile = result.user;
              self.globalVars.setUserProfile(this.userProfile, null);
              this.log.logs[this.constructor.name].info('Google Login Success');
              resolve('google');
            },
            error => {
              this.log.logs[this.constructor.name].error(
                'Firebase failure: ' + JSON.stringify(error)
              );
              resolve('Firebase failure: ' + JSON.stringify(error));
            }
          );
      }
    });
  }
}
