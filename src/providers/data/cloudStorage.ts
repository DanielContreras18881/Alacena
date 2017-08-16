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

  loadListData(name: string, uid: string) {
    return new Promise(resolve => {
      let ref = firebase
        .database()
        .ref("/listItems/" + uid + "_" + name + "/URL");

      ref.on("value", snapshot => {
        resolve(snapshot.val());
      });
    });
  }

  uploadListData(name: string, data: any[], uid: string) {
    const storage = firebase.storage();
    let fileName = uid + "_" + name + ".json";
    let fileRef = storage.ref("lists/" + fileName);
    var uploadTask = fileRef.putString(JSON.stringify(data));

    uploadTask.on(
      "state_changed",
      snapshot => {
        console.log("snapshot progess " + snapshot);
      },
      error => {
        console.log(error);
      },
      () => {
        let dataToSave = {
          URL: uploadTask.snapshot.downloadURL,
          name: uploadTask.snapshot.metadata.name,
          owners: [uid],
          lastUpdated: new Date().getTime()
        };
        firebase
          .database()
          .ref("listItems/" + uid + "_" + name)
          .set(dataToSave);
      }
    );
  }

  removeListData(name: string, uid: string) {
    const storage = firebase.storage();
    let fileName = uid + "_" + name + ".json";
    let fileRef = storage.ref("lists/" + fileName);
    fileRef.delete();
    firebase.database().ref("listItems/" + uid + "_" + name).remove();
  }

  uploadListsData(lists: any, uid: string) {
    firebase.database().ref("lists/" + uid).set(lists);
  }

  loadColorsData(uid: string) {
    return new Promise(resolve => {
      let ref = firebase.database().ref("/colors/");
      ref.once("value").then(function(snapshot) {
		  // We need to create this array first to store our local data
		  let colorsList = JSON.parse(JSON.stringify(snapshot));
        let colorArray = [];
        for (let key in colorsList) {
          if (colorsList.hasOwnProperty(key)) {
            let color = JSON.parse(JSON.stringify(colorsList[key]));
            colorArray.push(color);
          }
        }		  
		  resolve(colorArray);
      });
    });
  }

  loadListsData(uid: string) {
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
