import { Injectable } from '@angular/core';

// TODO: get data from firebase or local if not found, meke central service for data

import { ListsData } from '../data/lists-data';
import { ListData } from '../data/list-data';
import { ItemData } from '../data/item-data';
import { CategoriesData } from '../data/categories-data';
import { DefaultIcons } from '../default-icons/default-icons';
import { ConfigData } from '../data/config-data';

@Injectable()
export class GlobalVars {
  server: boolean = false;

  userProfile: any = null;

  iconsData: any;

  constructor(
    private listsDataService: ListsData,
    private listDataService: ListData,
    private itemDataService: ItemData,
    private iconsDataService: DefaultIcons,
    private categoriesDataService: CategoriesData,
    private configDataService: ConfigData
  ) {}

  setUserProfile(userProfile: any) {
    this.userProfile = userProfile;
  }

  getUserProfile() {
    return this.userProfile;
  }

  setConfigData(value) {
    this.configDataService.setConfigData(value, this.userProfile);
  }

  getConfigData() {
    return new Promise(resolve => {
      this.configDataService.getConfigData(this.userProfile).then(data => {
        resolve(data);
      });
    });
  }

  getColorsData() {
    return new Promise(resolve => {
      this.listsDataService.getColorsData(this.userProfile).then(data => {
        resolve(data);
      });
    });
  }

  setListsData(value) {
    this.listsDataService.setListsData(value, this.userProfile);
  }

  getListsData() {
    return new Promise(resolve => {
      this.listsDataService.getListsData(this.userProfile).then(data => {
        resolve(data);
      });
    });
  }

  getListData(name: string) {
    return new Promise(resolve => {
      this.listDataService
        .getListItemsData(name, this.userProfile)
        .then(data => {
          resolve(data);
        });
    });
  }
  setListData(name: string, data: any[]) {
    this.listDataService.setListData(name, data, this.userProfile);
  }

  removetItemListData(name: string) {
    this.listDataService.removeListData(name, this.userProfile);
  }

  setItemsData(value) {
    this.itemDataService.setItemsData(value, this.userProfile);
  }

  getItemsData() {
    return new Promise(resolve => {
      this.itemDataService.getItemsData(this.userProfile).then(data => {
        resolve(data);
      });
    });
  }

  setCategoriesData(value) {
    this.categoriesDataService.setCategoriesData(value, this.userProfile);
  }

  getCategoriesData() {
    return new Promise(resolve => {
      this.categoriesDataService
        .getCategoriesData(this.userProfile)
        .then(data => {
          resolve(data);
        });
    });
  }

  setDefaultIconsData(value) {
    this.iconsData = value;
  }

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
}
