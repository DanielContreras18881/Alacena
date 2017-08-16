import { GlobalVars } from "../global-vars/global-vars";
import { Injectable } from "@angular/core";
import { NgZone } from "@angular/core";
import { GooglePlus } from "@ionic-native/google-plus";
import firebase from "firebase";
import { Platform } from "ionic-angular";

declare var gapi: any;
declare var self: any;
/*
  Generated class for the AuthService provider

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/

@Injectable()
export class AuthService {
  userProfile: any = null;
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
  logout(type: string) {
    console.log(type);
    return new Promise(resolve => {
      self = this;
      switch (type) {
        case "twitter":
          resolve("OK");
          break;
        case "google":
          firebase.auth().signOut();
          this.userProfile = null;
          self.globalVars.setUserProfile(null);
          resolve("OK");
          break;
        case "facebook":
          resolve("OK");
          break;
        case "email":
          resolve("OK");
          break;
      }
    });
  }
  twitterLogin() {
    return new Promise(resolve => {
      resolve("twitter");
    });
  }
  facebookLogin() {
    return new Promise(resolve => {
      resolve("facebook");
    });
  }
  emailLogin() {
    return new Promise(resolve => {
      resolve("email");
    });
  }
  googleAuth() {
    return new Promise(resolve => {
      self = this;
      var provider = new firebase.auth.GoogleAuthProvider();
      var res = null;
      if (this.plt.is("ios") || this.plt.is("android")) {
        this.googlePlus
          .login({
            webClientId:
              "354280052179-fkmk7g20grbpkctmdgtt53oiel3be7a1.apps.googleusercontent.com",
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
                resolve("google");
              })
              .catch(error =>
                resolve("Firebase failure: " + JSON.stringify(error))
              );
          })
          .catch(err => resolve("Error: " + JSON.stringify(err)));
      } else {
        firebase.auth().signInWithRedirect(provider).then(
          result => {
            this.userProfile = result.user;
            self.globalVars.setUserProfile(this.userProfile);
            resolve("google");
          },
          error => {
            resolve("Firebase failure: " + JSON.stringify(error));
          }
        );
      }
    });
  }
}
