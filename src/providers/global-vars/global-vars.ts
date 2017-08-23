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

  configData: any;
  itemsData: any;
  listData: any;
  listsData: any;
  categoriesData: any;
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
    this.configData = value;
  }

  getConfigData() {
    if (this.configData) {
      return Promise.resolve(this.configData);
    } else {
      return new Promise(resolve => {
        this.configDataService.getConfigData().then(data => {
          this.configData = data;
          resolve(data);
        });
      });
    }
  }

  getColorsData() {
    return new Promise(resolve => {
      this.listsDataService.getColorsData(this.userProfile).then(data => {
        resolve(data);
      });
    });
  }

  setListsData(value) {
    this.listsData = value;
    this.listsDataService.setListsData(value, this.userProfile);
  }

  getListsData() {
    if (this.listsData) {
      return Promise.resolve(this.listsData);
    } else {
      return new Promise(resolve => {
        this.listsDataService.getListsData(this.userProfile).then(data => {
          this.listsData = data;
          resolve(data);
        });
      });
    }
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
    this.itemsData = value;
  }

  getItemsData() {
    if (this.itemsData) {
      return Promise.resolve(this.itemsData);
    } else {
      return new Promise(resolve => {
        this.itemDataService.getItemsData().then(data => {
          this.itemsData = data;
          resolve(data);
        });
      });
    }
  }

  setCategoriesData(value) {
    this.categoriesData = value;
  }

  getCategoriesData() {
    if (this.categoriesData) {
      return Promise.resolve(this.categoriesData);
    } else {
      return new Promise(resolve => {
        this.categoriesDataService.getCategoriesData().then(data => {
          this.categoriesData = data;
          resolve(data);
        });
      });
    }
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
