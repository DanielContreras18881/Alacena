import { Icon } from '../../classes/icon';
import { ListItem } from '../../classes/listItem';
import { List } from '../../classes/list';
import { Injectable } from '@angular/core';

import { CategorysProvider } from '../categorys-provider';
import { ConfigProvider } from '../config-provider';
import { ItemsProvider } from '../items-provider';
import { ListProvider } from '../list-provider';
import { ListsProvider } from '../lists-provider';
import { DefaultIcons } from '../default-icons/default-icons';

@Injectable()
export class GlobalVars {
  server: boolean = false;

  userProfile: any = null;

  iconsData: Icon[];

  constructor(
    private listsDataProvider: ListsProvider,
    private listDataProvider: ListProvider,
    private itemsDataProvider: ItemsProvider,
    private iconsDataService: DefaultIcons,
    private categoriesDataProvider: CategorysProvider,
    private configProvider: ConfigProvider
  ) {}

  setUserProfile(userProfile: any): any {
    return new Promise(resolve => {
      this.userProfile = userProfile;
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

  getUserProfile() {
    return this.userProfile;
  }

  setConfigData(value) {
    this.configProvider.setConfigData(value, this.userProfile);
  }

  getConfigData() {
    return new Promise(resolve => {
      this.configProvider.getConfigData(this.userProfile).then(data => {
        resolve(data);
      });
    });
  }

  getColorsData() {
    return new Promise(resolve => {
      this.listsDataProvider.getColorsData(this.userProfile).then(data => {
        resolve(data);
      });
    });
  }

  setListsData(value) {
    this.listsDataProvider.setListsData(value, this.userProfile);
  }

  getListsData() {
    return new Promise(resolve => {
      this.listsDataProvider.getListsData(this.userProfile).then(data => {
        resolve(data);
      });
    });
  }

  getListData(name: string) {
    return new Promise(resolve => {
      this.listDataProvider
        .getListItemsData(name, this.userProfile)
        .then(data => {
          resolve(data);
        });
    });
  }
  setListData(name: string, data: ListItem[]) {
    this.listDataProvider.setListData(name, data, this.userProfile);
  }

  removetItemListData(name: string) {
    this.listDataProvider.removeListData(name, this.userProfile);
  }

  setItemsData(value) {
    this.itemsDataProvider.setItemsData(value, this.userProfile);
  }

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

  getItemsData() {
    return new Promise(resolve => {
      this.itemsDataProvider.getItemsData(this.userProfile).then(data => {
        resolve(data);
      });
    });
  }

  setCategoriesData(value) {
    this.categoriesDataProvider.setCategoriesData(value, this.userProfile);
  }

  getCategoriesData() {
    return new Promise(resolve => {
      this.categoriesDataProvider
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
