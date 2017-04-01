import {Component} from '@angular/core';

import { ModalController, AlertController} from 'ionic-angular';

import {CategoriesService} from '../../providers/categories/categoriesService';

import {OrderBy} from '../../pipes/orderBy';

import {GlobalVars} from '../../providers/global-vars/global-vars';

import {CategoryInfoPage} from '../category-info/category-info';

/*
  Generated class for the ItemsPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'categories.html',
  providers: [OrderBy, CategoriesService]
})
export class CategoriesPage {
  public categories: any;
  public searchBar: boolean;
  public searchCategory: string;
  public icons: any;
  public enableSelectToRemove: boolean;
  public categoriesToRemove: any;

  constructor(
              private globalVars: GlobalVars,
              public mod: ModalController,
              public alertCtrl: AlertController,
              private catService: CategoriesService,
              private order: OrderBy) {}

  ngOnInit() {
    this.searchBar = false;
    this.enableSelectToRemove = false;
    this.categoriesToRemove = [];
    this.icons = this.globalVars.getDefaulIconsData();
    this.initializeCategories();
  }

  initializeCategories() {
    this.categories = this.order.transform(this.globalVars.getCategoriesData(), ['+categoryName']);
  }

  searchMatches(event) {
    this.initializeCategories();
    if (this.searchCategory && this.searchCategory.trim() !== '') {
      this.categories = this.categories.filter((item) => {
        return (item.categoryName.toLowerCase().indexOf(this.searchCategory.toLowerCase()) > -1);
      });
    }
  }

  toggleSearchBar(event) {
    this.searchBar = !this.searchBar;
  }

  changeCategoryIcon(event, category) {
    this.catService.changeCategoryIcon(category, this.icons);
  }

  deleteCategory(event, category) {
    let confirm = this.alertCtrl.create({
      title: 'Removing ' + category.categoryName,
      message: 'Do you like to remove ' + category.categoryName,
      buttons: [
        {
          text: 'No',
          handler: () => {
            console.log('No removed');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.globalVars.getCategoriesData().splice(this.globalVars.getCategoriesData().indexOf(category), 1);
            this.categories.splice(this.categories.indexOf(category), 1);
            // Save data to storage
          }
        }
      ]
    });
    confirm.present();
  }

  addCategory(event) {
    // Save data to storage
    let newCategory = {
      'categoryName'  : 'NEW_CATEGORY',
      'icon'          : 'images/icons/default.png',
      'measurement'   : 'UNIDADES'
    };
    let categoryModal = this.mod.create(CategoryInfoPage, {newCategory: newCategory, icons: this.icons});
    categoryModal.onDidDismiss((item) => {
      if (item !== undefined) {
        this.globalVars.getCategoriesData().push(item);
        // this.categories.push(newCategory);
      }
    });
    categoryModal.present();
  }

  onMeasurementChange(event, category) {
    // TODO: Save data to storage, reflect in the view
    if (category.measurement === 'UNIDADES') {
      category.unitStep = 0.1;
    } else if (category.measurement === 'GRAMOS') {
      category.unitStep = 100;
    } else if (category.measurement === 'LITROS') {
      category.unitStep = 0.5;
    } else {
      category.unitStep = 0.5;
    }
  }
  /*
removeCategories(event) {
            this.categoriesToRemove = [];
            this.enableSelectToRemove = !this.enableSelectToRemove;
  }
  */
  selectedCategory(event, item) {
      console.log('Category selected' + JSON.stringify(item));
      this.categoriesToRemove.push(item);
  }

  removeCategories(event) {
    this.categoriesToRemove.forEach((category, index) => {
      this.globalVars.getCategoriesData().splice(this.globalVars.getCategoriesData().indexOf(category), 1);
      this.categories.splice(this.categories.indexOf(category), 1);
    });
    this.categoriesToRemove = [];
    this.enableSelectToRemove = !this.enableSelectToRemove;
  }
}
