import {Injectable} from '@angular/core';

// TODO: get data from firebase or local if not found, meke central service for data

@Injectable()
export class GlobalVars {

  server: boolean = false;

  configData: any;
  itemsData: any;
  listData: any;
  listsData: any;
  categoriesData: any;
  iconsData: any;

  constructor() {
  }

  setConfigData(value) {
    this.configData = value;
  }

  getConfigData() {
    return this.configData;
  }

  setListsData(value) {
    this.listsData = value;
  }

  getListsData() {
    return this.listsData;
  }

  setListData(value) {
    this.listData = value;
  }

  getListData() {
    return this.listData;
  }

  setItemsData(value) {
    this.itemsData = value;
  }

  getItemsData() {
    return this.itemsData;
  }

  setCategoriesData(value) {
    this.categoriesData = value;
  }

  getCategoriesData() {
    return this.categoriesData;
  }

  setDefaultIconsData(value) {
    this.iconsData = value;
  }

  getDefaulIconsData() {
    return this.iconsData;
  }

}
