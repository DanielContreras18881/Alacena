import { ListItem } from '../../classes/listItem';
import { List } from '../../classes/list';
import { Injectable } from '@angular/core';

import { CategorysProvider } from '../categorys-provider';
import { ConfigProvider } from '../config-provider';
import { ItemsProvider } from '../items-provider';
import { ListProvider } from '../list-provider';
import { ListsProvider } from '../lists-provider';
import { DefaultIcons } from '../default-icons/default-icons';
/**
 * Provider to manage, centralised, the app data
 *
 * @export
 * @class GlobalVars
 */
@Injectable()
export class GlobalVars {
  server: boolean = false;

  userProfile: any = null;
  userConnected: boolean = false;

  iconsData: string[];

  constructor(
    private listsDataProvider: ListsProvider,
    private listDataProvider: ListProvider,
    private itemsDataProvider: ItemsProvider,
    private iconsDataService: DefaultIcons,
    private categoriesDataProvider: CategorysProvider,
    private configProvider: ConfigProvider
  ) {}
  /**
   * Save user profile on login and load local data to cloud service
   *
   * @param {*} userProfile
   * @returns {*}
   * @memberof GlobalVars
   */
  setUserProfile(userProfile: any): any {
    return new Promise(resolve => {
      this.userProfile = userProfile;
      this.userConnected = true;
      this.categoriesDataProvider
        .getCategoriesData(this.userProfile)
        .then(data => {
          this.setCategoriesData(data);
        });
      this.configProvider.getConfigData(this.userProfile).then(data => {
        this.setConfigData(data);
      });
      this.itemsDataProvider.getItemsData(this.userProfile).then(data => {
        this.setItemsData(data);
      });
      this.listsDataProvider.getListsData(this.userProfile).then(data => {
        this.setListsData(data);
        data.forEach(element => {
          this.listDataProvider
            .getListItemsData(element.nombreLista, userProfile)
            .then(result => {
              this.setListData(element.nombreLista, <ListItem[]>result);
            });
        });
      });
      resolve();
    });
  }
  /**
   * Return user profile
   *
   * @returns
   * @memberof GlobalVars
   */
  getUserProfile() {
    return this.userProfile;
  }
  /**
   * Disconnect user
   *
   * @returns
   * @memberof GlobalVars
   */
  disconnectUser() {
    this.userConnected = false;
  }
  /**
   * Return if user is connected or not
   *
   * @returns
   * @memberof GlobalVars
   */
  getUserConnected() {
    return this.userConnected;
  }
  /**
   * Save config data
   *
   * @param {any} value
   * @memberof GlobalVars
   */
  setConfigData(value) {
    this.configProvider.setConfigData(value, this.userProfile);
  }
  /**
   * Recover config data
   *
   * @returns
   * @memberof GlobalVars
   */
  getConfigData() {
    return new Promise(resolve => {
      this.configProvider.getConfigData(this.userProfile).then(data => {
        resolve(data);
      });
    });
  }
  /**
   * Get colors data
   *
   * @returns
   * @memberof GlobalVars
   */
  getColorsData() {
    return new Promise(resolve => {
      this.listsDataProvider.getColorsData(this.userProfile).then(data => {
        resolve(data);
      });
    });
  }
  /**
   * Save lists data
   *
   * @param {any} value
   * @memberof GlobalVars
   */
  setListsData(value) {
    this.listsDataProvider.setListsData(value, this.userProfile);
  }
  /**
   * Recover lists data
   *
   * @returns
   * @memberof GlobalVars
   */
  getListsData() {
    return new Promise(resolve => {
      this.listsDataProvider.getListsData(this.userProfile).then(data => {
        resolve(data);
      });
    });
  }
  /**
   * Recover list data of a list provided
   *
   * @param {string} name
   * @returns
   * @memberof GlobalVars
   */
  getListData(name: string) {
    return new Promise(resolve => {
      this.listDataProvider
        .getListItemsData(name, this.userProfile)
        .then(data => {
          resolve(data);
        });
    });
  }
  /**
   * Save list data of a list provided
   *
   * @param {string} name
   * @param {ListItem[]} data
   * @memberof GlobalVars
   */
  setListData(name: string, data: ListItem[]) {
    this.listDataProvider.setListData(name, data, this.userProfile);
  }
  /**
   * Remove items data of a list provided
   *
   * @param {string} name
   * @memberof GlobalVars
   */
  removetItemListData(name: string) {
    this.listDataProvider.removeListData(name, this.userProfile);
  }
  /**
   * Save items data
   *
   * @param {any} value
   * @memberof GlobalVars
   */
  setItemsData(value) {
    this.itemsDataProvider.setItemsData(value, this.userProfile);
  }
  /**
   * Add one item to items data
   *
   * @param {ListItem} value
   * @memberof GlobalVars
   */
  addOneItem(value: ListItem) {
    this.itemsDataProvider.getItemsData(this.userProfile).then(data => {
      let exist =
        data.filter(item => item.nombreElemento === value.nombreElemento)
          .length > 0;
      if (!exist) {
        data.push(value);
        this.itemsDataProvider.setItemsData(data, this.userProfile);
      }
    });
  }
  /**
   * Recover items data
   *
   * @returns
   * @memberof GlobalVars
   */
  getItemsData() {
    return new Promise(resolve => {
      this.itemsDataProvider.getItemsData(this.userProfile).then(data => {
        resolve(data);
      });
    });
  }
  /**
   * Save categories data
   *
   * @param {any} value
   * @memberof GlobalVars
   */
  setCategoriesData(value) {
    this.categoriesDataProvider.setCategoriesData(value, this.userProfile);
  }
  /**
   * Recover categories data
   *
   * @returns
   * @memberof GlobalVars
   */
  getCategoriesData() {
    return new Promise(resolve => {
      this.categoriesDataProvider
        .getCategoriesData(this.userProfile)
        .then(data => {
          resolve(data);
        });
    });
  }
  /**
   * Recover default icons data
   *
   * @returns
   * @memberof GlobalVars
   */
  getDefaulIconsData() {
    if (this.iconsData) {
      return Promise.resolve(this.iconsData);
    } else {
      return new Promise(resolve => {
        this.iconsDataService.getIcons().then(data => {
          this.iconsData = data;
          resolve(data);
        });
      });
    }
  }
  /**
   * Recover old version app data
   *
   * @returns
   * @memberof GlobalVars
   */
  getOldData() {
    return new Promise(resolve => {
      this.configProvider.getOldConfigData();
      this.itemsDataProvider.getOldItems();
      this.categoriesDataProvider.getCategoriesData(null);
      this.listsDataProvider.getOldLists().then(lists => {
        this.listDataProvider.getOldListItemsData(<List[]>lists);
      });
    });
  }
}
