import { CategoryInfoPage } from '../category-info/category-info';
import { Component } from '@angular/core';
import {
  AlertController,
  ModalController,
  ToastController
} from 'ionic-angular';

import { OrderBy } from '../../pipes/orderBy';
import { CategoriesService } from '../../providers/categories/categoriesService';
import { GlobalVars } from '../../providers/global-vars/global-vars';

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
  public categories: any[] = [];
  public searchBar: boolean;
  public searchCategory: string;
  public icons: any;
  public enableSelectToRemove: boolean;
  public categoriesToRemove: any;
  unitStep: number;
  measurement: string;

  type: string = 'Categories';
  orderSelected: number = 1;

  constructor(
    public mod: ModalController,
    public alertCtrl: AlertController,
    private catService: CategoriesService,
    private globalVars: GlobalVars,
    private order: OrderBy,
    private toastCtrl: ToastController
  ) {
    this.globalVars.getConfigData().then(data => {
      this.measurement = (<any>data).unitDefault;
      this.unitStep = (<any>data).stepDefault;
      console.log(this.unitStep);
      console.log(this.measurement);
    });
  }

  ngOnInit() {
    this.searchBar = false;
    this.enableSelectToRemove = false;
    this.categoriesToRemove = [];
    this.globalVars.getDefaulIconsData().then(data => {
      this.icons = data;
    });
    this.initializeCategories(null);
  }

  initializeCategories(filter: string) {
    this.globalVars.getCategoriesData().then(data => {
      this.categories = <any[]>data;
      this.sortItems(this.orderSelected);
      if (filter) {
        this.categories = this.categories.filter(item => {
          return (
            item.categoryName
              .toLowerCase()
              .indexOf(this.searchCategory.toLowerCase()) > -1
          );
        });
      }
    });
  }

  searchMatches(event) {
    if (this.searchCategory && this.searchCategory.trim() !== '') {
      this.initializeCategories(this.searchCategory);
    } else {
      this.initializeCategories(null);
    }
  }

  toggleSearchBar(event) {
    this.searchBar = !this.searchBar;
  }

  changeCategoryIcon(event, category) {
    this.catService.changeCategoryIcon(category, this.icons);
  }

  sortItems(orderBy: number) {
    this.orderSelected = orderBy;
    switch (orderBy) {
      case 1:
        this.categories = this.order.transform(this.categories, [
          '+categoryName'
        ]);
        break;
      case 2:
        this.categories = this.order.transform(this.categories, [
          '+measurement'
        ]);
        break;
      case 3:
        this.categories = this.order.transform(this.categories, ['+unitStep']);
        break;
    }
  }

  reorder(event) {
    let reorder = this.alertCtrl.create();
    reorder.setTitle('Sort by');

    reorder.addInput({
      type: 'radio',
      label: 'NOMBRE',
      value: '1',
      checked: this.orderSelected === 1
    });
    reorder.addInput({
      type: 'radio',
      label: 'MEASUREMENT',
      value: '2',
      checked: this.orderSelected === 2
    });
    reorder.addInput({
      type: 'radio',
      label: 'PASO_MEDIDA',
      value: '3',
      checked: this.orderSelected === 3
    });

    reorder.addButton('Cancel');
    reorder.addButton({
      text: 'OK',
      handler: data => {
        this.sortItems(Number.parseInt(data));
      }
    });
    reorder.present();
  }

  deleteCategory(event, category) {
    let confirm = this.alertCtrl.create({
      title: 'Removing ' + category.categoryName,
      message: 'Do you like to remove ' + category.categoryName + '?',
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
            // this.globalVars.getCategoriesData().splice(this.globalVars.getCategoriesData().indexOf(category), 1);
            this.categories.splice(this.categories.indexOf(category), 1);
            // TODO : Store changes
          }
        }
      ]
    });
    confirm.present();
  }

  removeElements(removed: any[]) {
    removed.forEach(categoryRemoved => {
      this.categories = this.categories.filter(
        category => category.categoryName !== categoryRemoved
      );
      this.globalVars.setCategoriesData(this.categories);
    });
  }
  addCategory(event) {
    console.log(this.measurement);
    // Save data to storage
    let newCategory = {
      categoryName: 'NEW_CATEGORY',
      icon: 'images/icons/default.png',
      measurement: this.measurement,
      unitStep: this.unitStep
    };
    let categoryModal = this.mod.create(CategoryInfoPage, {
      newCategory: newCategory,
      icons: this.icons
    });
    categoryModal.onDidDismiss(item => {
      if (item !== undefined) {
        if (
          this.categories.filter(
            cat =>
              cat.categoryName.toLowerCase() === item.categoryName.toLowerCase()
          ).length === 0
        ) {
          this.categories.push(item);
          this.globalVars.setCategoriesData(this.categories);
        } else {
          const toast = this.toastCtrl.create({
            message: 'This category already exists!',
            duration: 1000,
            position: 'bottom'
          });
          toast.present();
        }
      }
    });
    categoryModal.present();
  }

  editCategory(event, category) {
    let oldCategory = category.categoryName;
    let edit = this.alertCtrl.create({
      title: 'Edit Category',
      inputs: [
        {
          name: 'nombreCategory',
          value: oldCategory,
          type: 'text',
          placeholder: 'Name'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Confirm',
          handler: data => {
            category.categoryName = data.nombreCategory;
            this.globalVars.setCategoriesData(this.categories);
          }
        }
      ]
    });
    edit.present();
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
      // TODO : Store changes
      //this.globalVars.getCategoriesData().splice(this.globalVars.getCategoriesData().indexOf(category), 1);
      this.categories.splice(this.categories.indexOf(category), 1);
    });
    this.categoriesToRemove = [];
    this.enableSelectToRemove = !this.enableSelectToRemove;
  }
}
