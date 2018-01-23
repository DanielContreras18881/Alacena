import { Item } from '../../classes/item';
import { Category } from '../../classes/category';
import { List } from '../../classes/list';
import { ListItem } from '../../classes/listItem';
import 'rxjs/add/operator/map';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import firebase from 'firebase';

import { Log } from '../log/log';
/**
 * Provider to manage cloud storage of logged user
 *
 * @export
 * @class CloudStorage
 */
@Injectable()
export class CloudStorage {
  constructor(private http: Http, public log: Log) {
    this.log.setLogger(this.constructor.name);
  }
  setUserToken(token: string, uid: string) {
    this.log.logs[this.constructor.name].info(
      'setUserToken:' + uid + ':' + token
    );
    firebase
      .database()
      .ref('tokens/' + uid)
      .set(token);
  }
  /**
   * Get config data
   *
   * @param {string} uid
   * @returns
   * @memberof CloudStorage
   */
  loadConfigData(uid: string) {
    this.log.logs[this.constructor.name].info('loadConfigData:' + uid);
    return new Promise(resolve => {
      let ref = firebase.database().ref('/config/');
      ref.once('value').then(function(snapshot) {
        let object = JSON.parse(JSON.stringify(snapshot));
        if (object && object[uid]) {
          let configs = JSON.parse(JSON.stringify(object[uid]));
          let configArray = [];
          for (let key in configs) {
            if (configs.hasOwnProperty(key)) {
              let config = JSON.parse(JSON.stringify(configs[key]));
              configArray.push(config);
            }
          }
          let data = JSON.parse(JSON.stringify(configArray[0]));
          let languages = [];
          for (let key in data.idiomas) {
            if (data.idiomas.hasOwnProperty(key)) {
              let language = JSON.parse(JSON.stringify(data.idiomas[key]));
              languages.push(language);
            }
          }
          data.idiomas = languages;
          resolve(data);
        } else {
          resolve(null);
        }
      });
    });
  }
  /**
   * Get elements data
   *
   * @param {string} uid
   * @returns
   * @memberof CloudStorage
   */
  loadElementData(uid: string) {
    this.log.logs[this.constructor.name].info('loadElementData:' + uid);
    return new Promise(resolve => {
      let ref = firebase.database().ref('/lists/');
      ref.once('value').then(function(snapshot) {
        let object = JSON.parse(JSON.stringify(snapshot));
        if (object && object[uid]) {
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
  /**
   * Get data of a list provided
   *
   * @param {string} name
   * @param {string} uid
   * @returns
   * @memberof CloudStorage
   */
  loadListData(name: string, uid: string) {
    this.log.logs[this.constructor.name].info('loadListData:' + uid);
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
            content
              .get(url)
              .map(res => res.json())
              .subscribe(
                data => {
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
  /**
   * Upload data for a list provided
   *
   * @param {string} name
   * @param {ListItem[]} data
   * @param {string} uid
   * @memberof CloudStorage
   */
  uploadListData(name: string, data: ListItem[], uid: string) {
    this.log.logs[this.constructor.name].info(
      'uploadListData:' + uid + ':' + name
    );
    const storage = firebase.storage();
    let fileName = uid + '_' + name + '.json';
    let fileRef = storage.ref('lists/' + fileName);
    var uploadTask = fileRef.putString(JSON.stringify(data));

    uploadTask.on(
      'state_changed',
      snapshot => {},
      error => {},
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
  /**
   * Remove data of a favorite list provided
   *
   * @param {string} name
   * @param {string} uid
   * @memberof CloudStorage
   */
  removeFavoritesListData(name: string, uid: string) {
    this.log.logs[this.constructor.name].info(
      'removeFavoritesListData:' + uid + ':' + name
    );
    const storage = firebase.storage();
    let fileName = uid + '_' + name + '.json';
    let fileRef = storage.ref('favorites/' + fileName);
    fileRef.delete();
    firebase
      .database()
      .ref('listItems/' + uid + '_' + name)
      .remove();
  }
  /**
   * Remove data of a list provided
   *
   * @param {string} name
   * @param {string} uid
   * @memberof CloudStorage
   */
  removeListData(name: string, uid: string) {
    this.log.logs[this.constructor.name].info(
      'removeListData:' + uid + ':' + name
    );
    const storage = firebase.storage();
    let fileName = uid + '_' + name + '.json';
    let fileRef = storage.ref('lists/' + fileName);
    fileRef.delete();
    firebase
      .database()
      .ref('listItems/' + uid + '_' + name)
      .remove();
  }
  /**
   * Upload data of favorites lists
   *
   * @param {List[]} lists
   * @param {string} uid
   * @memberof CloudStorage
   */
  uploadFavoritesListsData(lists: List[], uid: string) {
    this.log.logs[this.constructor.name].info(
      'uploadFavoritesListsData:' + uid
    );
    firebase
      .database()
      .ref('favorites/' + uid)
      .set(lists);
  }
  /**
   * Upload data of lists
   *
   * @param {List[]} lists
   * @param {string} uid
   * @memberof CloudStorage
   */
  uploadListsData(lists: List[], uid: string) {
    this.log.logs[this.constructor.name].info('uploadListsData:' + uid);
    firebase
      .database()
      .ref('lists/' + uid)
      .set(lists);
  }
  /**
   * Upload config data
   *
   * @param {*} configs
   * @param {string} uid
   * @memberof CloudStorage
   */
  uploadConfigData(configs: any, uid: string) {
    this.log.logs[this.constructor.name].info('uploadConfigData:' + uid);
    firebase
      .database()
      .ref('config/' + uid)
      .set(configs);
  }
  /**
   * Upload elements data
   *
   * @param {Item[]} items
   * @param {string} uid
   * @memberof CloudStorage
   */
  uploadItemsData(items: Item[], uid: string) {
    this.log.logs[this.constructor.name].info('uploadItemsData:' + uid);
    firebase
      .database()
      .ref('elements/' + uid)
      .set(items);
  }
  /**
   * Upload categories data
   *
   * @param {Category[]} categories
   * @param {string} uid
   * @memberof CloudStorage
   */
  uploadCategoriesData(categories: Category[], uid: string) {
    this.log.logs[this.constructor.name].info('uploadCategoriesData:' + uid);
    firebase
      .database()
      .ref('categories/' + uid)
      .set(categories);
  }
  /**
   * Get favorites lists data
   *
   * @param {string} uid
   * @returns
   * @memberof CloudStorage
   */
  loadFavoritesListsData(uid: string) {
    this.log.logs[this.constructor.name].info('loadFavoritesListsData:' + uid);
    return new Promise(resolve => {
      let ref = firebase.database().ref('/favorites/');
      ref.once('value').then(function(snapshot) {
        let object = JSON.parse(JSON.stringify(snapshot));
        if (object && object[uid]) {
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
  /**
   * Get lists data
   *
   * @param {string} uid
   * @returns
   * @memberof CloudStorage
   */
  loadListsData(uid: string) {
    this.log.logs[this.constructor.name].info('loadListsData:' + uid);
    return new Promise(resolve => {
      let ref = firebase.database().ref('/lists/');
      ref.once('value').then(function(snapshot) {
        let object = JSON.parse(JSON.stringify(snapshot));
        if (object && object[uid]) {
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
  /**
   * Get elements data
   *
   * @param {string} uid
   * @returns
   * @memberof CloudStorage
   */
  loadItemsData(uid: string) {
    this.log.logs[this.constructor.name].info('loadItemsData:' + uid);
    return new Promise(resolve => {
      let ref = firebase.database().ref('/elements/');
      ref.once('value').then(function(snapshot) {
        let object = JSON.parse(JSON.stringify(snapshot));
        if (object && object[uid]) {
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
  /**
   * Get categories data
   *
   * @param {string} uid
   * @returns
   * @memberof CloudStorage
   */
  loadCategoriesData(uid: string) {
    this.log.logs[this.constructor.name].info('loadCategoriesData:' + uid);
    return new Promise(resolve => {
      let ref = firebase.database().ref('/categories/');
      ref.once('value').then(function(snapshot) {
        let object = JSON.parse(JSON.stringify(snapshot));
        if (object && object[uid]) {
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
