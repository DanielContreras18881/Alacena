import { Injectable } from "@angular/core";
import "rxjs/add/operator/map";

import firebase from "firebase";

// TODO: remove or redefine

/*
  Generated class for the Data provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class CloudStorage {
  constructor() {}

  loadConfigData(uid: string) {
    return new Promise(resolve => {
      let ref = firebase.database().ref("/lists/");
      ref.once("value").then(function(snapshot) {
        // We need to create this array first to store our local data
        let object = JSON.parse(JSON.stringify(snapshot));
        let lists = JSON.parse(JSON.stringify(object[uid]));
        let listArray = [];
        for (let key in lists) {
          if (lists.hasOwnProperty(key)) {
            let list = JSON.parse(JSON.stringify(lists[key]));
            listArray.push(list);
          }
        }
        resolve(listArray);
      });
    });
  }

  loadElementData(uid: string) {
    return new Promise(resolve => {
      let ref = firebase.database().ref("/lists/");
      ref.once("value").then(function(snapshot) {
        // We need to create this array first to store our local data
        let object = JSON.parse(JSON.stringify(snapshot));
        let lists = JSON.parse(JSON.stringify(object[uid]));
        let listArray = [];
        for (let key in lists) {
          if (lists.hasOwnProperty(key)) {
            let list = JSON.parse(JSON.stringify(lists[key]));
            listArray.push(list);
          }
        }
        resolve(listArray);
      });
    });
  }

  uploadListsData(lists: any, uid: string) {
    let newKey = firebase.database().ref().child("lists").push().key;
    let updates = {};
    updates["/lists/" + newKey] = lists;
    firebase.database().ref("lists/" + uid).set(lists);
  }
  loadListData(uid: string) {
    return new Promise(resolve => {
      let ref = firebase.database().ref("/lists/");
      ref.once("value").then(function(snapshot) {
        // We need to create this array first to store our local data
        let object = JSON.parse(JSON.stringify(snapshot));
        let lists = JSON.parse(JSON.stringify(object[uid]));
        let listArray = [];
        for (let key in lists) {
          if (lists.hasOwnProperty(key)) {
            let list = JSON.parse(JSON.stringify(lists[key]));
            listArray.push(list);
          }
        }
        resolve(listArray);
      });
    });
  }

  loadListsData(uid: string) {
    //TODO: check if there is connectivity https://ionicframework.com/docs/native/network/
    return new Promise(resolve => {
      let ref = firebase.database().ref("/lists/");
      ref.once("value").then(function(snapshot) {
        // We need to create this array first to store our local data
        let object = JSON.parse(JSON.stringify(snapshot));
        let lists = JSON.parse(JSON.stringify(object[uid]));
        let listArray = [];
        for (let key in lists) {
          if (lists.hasOwnProperty(key)) {
            let list = JSON.parse(JSON.stringify(lists[key]));
            listArray.push(list);
          }
        }
        resolve(listArray);
      });
    });
  }
}
