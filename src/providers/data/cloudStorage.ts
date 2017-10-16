import 'rxjs/add/operator/map';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import firebase from 'firebase';

/*
  Generated class for the Data provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class CloudStorage {
  constructor(private http: Http) {}

  loadConfigData(uid: string) {
    return new Promise(resolve => {
      let ref = firebase.database().ref('/config/');
      ref.once('value').then(function(snapshot) {
        // We need to create this array first to store our local data
        let object = JSON.parse(JSON.stringify(snapshot));
        if (object) {
          let configs = JSON.parse(JSON.stringify(object[uid]));
          let configArray = [];
          for (let key in configs) {
            if (configs.hasOwnProperty(key)) {
              let config = JSON.parse(JSON.stringify(configs[key]));
              configArray.push(config);
            }
          }
          resolve(configArray);
        } else {
          resolve(null);
        }
      });
    });
  }

  loadElementData(uid: string) {
    return new Promise(resolve => {
      let ref = firebase.database().ref('/lists/');
      ref.once('value').then(function(snapshot) {
        // We need to create this array first to store our local data
        let object = JSON.parse(JSON.stringify(snapshot));
        if (object) {
          let lists = JSON.parse(JSON.stringify(object[uid]));
          let listArray = [];
          for (let key in lists) {
            if (lists.hasOwnProperty(key)) {
              let list = JSON.parse(JSON.stringify(lists[key]));
              listArray.push(list);
            }
          }
          resolve(listArray);
        } else {
          resolve(null);
        }
      });
    });
  }

  loadListData(name: string, uid: string) {
    return new Promise(resolve => {
      let ref = firebase
        .database()
        .ref('/listItems/' + uid + '_' + name + '/URL');
      const content = this.http;
      ref.on('value', snapshot => {
        var storageRef = firebase
          .storage()
          .ref('/lists/' + uid + '_' + name + '.json');
        storageRef.getDownloadURL().then(
          url => {
            console.log(url);
            content
              .get(url)
              .map(res => res.json())
              .subscribe(
                data => {
                  console.log(data);
                  resolve(data);
                },
                error => {
                  resolve(null);
                }
              );
          },
          error => {
            resolve(null);
          }
        );
      });
    });
  }

  uploadListData(name: string, data: any[], uid: string) {
    const storage = firebase.storage();
    let fileName = uid + '_' + name + '.json';
    let fileRef = storage.ref('lists/' + fileName);
    var uploadTask = fileRef.putString(JSON.stringify(data));

    uploadTask.on(
      'state_changed',
      snapshot => {
        console.log('snapshot progess ' + snapshot);
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
          .ref('listItems/' + uid + '_' + name)
          .set(dataToSave);
      }
    );
  }

  removeListData(name: string, uid: string) {
    const storage = firebase.storage();
    let fileName = uid + '_' + name + '.json';
    let fileRef = storage.ref('lists/' + fileName);
    fileRef.delete();
    firebase
      .database()
      .ref('listItems/' + uid + '_' + name)
      .remove();
  }

  uploadListsData(lists: any, uid: string) {
    firebase
      .database()
      .ref('lists/' + uid)
      .set(lists);
  }

  uploadConfigData(configs: any, uid: string) {
    firebase
      .database()
      .ref('config/' + uid)
      .set(configs);
  }

  uploadItemsData(items: any, uid: string) {
    firebase
      .database()
      .ref('elements/' + uid)
      .set(items);
  }

  uploadCategoriesData(categories: any, uid: string) {
    firebase
      .database()
      .ref('categories/' + uid)
      .set(categories);
  }

  loadColorsData(uid: string) {
    return new Promise(resolve => {
      let ref = firebase.database().ref('/colors/');
      ref.once('value').then(function(snapshot) {
        // We need to create this array first to store our local data
        let colorsList = JSON.parse(JSON.stringify(snapshot));
        if (colorsList) {
          let colorArray = [];
          for (let key in colorsList) {
            if (colorsList.hasOwnProperty(key)) {
              let color = JSON.parse(JSON.stringify(colorsList[key]));
              colorArray.push(color);
            }
          }
          resolve(colorArray);
        } else {
          resolve(null);
        }
      });
    });
  }

  loadListsData(uid: string) {
    return new Promise(resolve => {
      let ref = firebase.database().ref('/lists/');
      ref.once('value').then(function(snapshot) {
        // We need to create this array first to store our local data
        let object = JSON.parse(JSON.stringify(snapshot));
        if (object) {
          let lists = JSON.parse(JSON.stringify(object[uid]));
          let listArray = [];
          for (let key in lists) {
            if (lists.hasOwnProperty(key)) {
              let list = JSON.parse(JSON.stringify(lists[key]));
              listArray.push(list);
            }
          }
          resolve(listArray);
        } else {
          resolve(null);
        }
      });
    });
  }

  loadItemsData(uid: string) {
    return new Promise(resolve => {
      let ref = firebase.database().ref('/elements/');
      ref.once('value').then(function(snapshot) {
        // We need to create this array first to store our local data
        let object = JSON.parse(JSON.stringify(snapshot));
        if (object) {
          let items = JSON.parse(JSON.stringify(object[uid]));
          let itemsArray = [];
          for (let key in items) {
            if (items.hasOwnProperty(key)) {
              let item = JSON.parse(JSON.stringify(items[key]));
              itemsArray.push(item);
            }
          }
          resolve(itemsArray);
        } else {
          resolve(null);
        }
      });
    });
  }

  loadCategoriesData(uid: string) {
    return new Promise(resolve => {
      let ref = firebase.database().ref('/categories/');
      ref.once('value').then(function(snapshot) {
        // We need to create this array first to store our local data
        let object = JSON.parse(JSON.stringify(snapshot));
        if (object) {
          let categories = JSON.parse(JSON.stringify(object[uid]));
          let categoriesArray = [];
          for (let key in categories) {
            if (categories.hasOwnProperty(key)) {
              let category = JSON.parse(JSON.stringify(categories[key]));
              categoriesArray.push(category);
            }
          }
          resolve(categoriesArray);
        } else {
          resolve(null);
        }
      });
    });
  }
}
