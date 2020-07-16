import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {
  AlertController,
  ModalController,
  ToastController
} from 'ionic-angular';

import { TranslateService } from '@ngx-translate/core';

import { OrderBy } from '../../pipes/orderBy';
import { CategoriesService } from '../../providers/categories/categoriesService';
import { GlobalVars } from '../../providers/global-vars/global-vars';

import { Category } from '../../classes/category';
import { CategoryInfoPage } from '../../components/category-info/category-info';

import { Log } from '../../providers/log/log';

/**
 * Page to manage custom categories by the user
 *
 * @export
 * @class CategorysPage
 */

@Component({
  selector: 'page-categorys-page',
  templateUrl: 'categorys-page.html',
  providers: [OrderBy, CategoriesService]
})
export class CategorysPage {
  categories: Category[] = [];
  searchBar: boolean;
  searchCategory: string;
  icons: string[];
  unitStep: number;
  measurement: string;

  type: string = 'Categories';
  orderSelected: number = 1;

  constructor(
    public navCtrl: NavController,
    public mod: ModalController,
    public alertCtrl: AlertController,
    private catService: CategoriesService,
    private globalVars: GlobalVars,
    private order: OrderBy,
    private toastCtrl: ToastController,
    public log: Log,
    public translate: TranslateService
  ) {
    this.log.setLogger(this.constructor.name);
  }

  ionViewDidLoad() {
    this.log.logs[this.constructor.name].info('ionViewDidLoad');
    this.searchBar = false;
    this.globalVars.getDefaulIconsData().then(data => {
      this.icons = <string[]>data;
    });
    this.globalVars.getConfigData().then(data => {
      this.measurement = (<any>data).unitDefault;
      this.unitStep = (<any>data).stepDefault;
    });
    this.initializeCategories(null);
  }
  /**
   * Initialize data when open or search categories
   *
   * @param {string} filter
   * @memberof CategorysPage
   */
  initializeCategories(filter: string) {
    this.log.logs[this.constructor.name].info('initializeCategories:' + filter);
    this.globalVars.getCategoriesData().then(data => {
      this.categories = <Category[]>data;
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
  /**
   * Event on search input filled
   *
   * @param {any} event
   * @memberof CategorysPage
   */
  searchMatches(event) {
    this.log.logs[this.constructor.name].info('searchMatches:' + event);
    if (this.searchCategory && this.searchCategory.trim() !== '') {
      this.initializeCategories(this.searchCategory);
    } else {
      this.initializeCategories(null);
    }
  }
  /**
   * Event to show or hide search bar
   *
   * @param {any} event
   * @memberof CategorysPage
   */
  toggleSearchBar(event) {
    this.searchBar = !this.searchBar;
  }
  /**
   * Event to change the category icon
   *
   * @param {any} event
   * @param {any} category
   * @memberof CategorysPage
   */
  changeCategoryIcon(event, category) {
    this.catService.changeCategoryIcon(category, this.icons);
  }
  /**
   * Event to sort items by a selected value
   *
   * @param {number} orderBy
   * @memberof CategorysPage
   */
  sortItems(orderBy: number) {
    this.log.logs[this.constructor.name].info('sortItems:' + orderBy);
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
  /**
   * Event to show options to sort items
   *
   * @param {any} event
   * @memberof CategorysPage
   */
  reorder(event) {
    let reorder = this.alertCtrl.create();
    reorder.setTitle(this.translate.instant('Ordenar'));

    reorder.addInput({
      type: 'radio',
      label: this.translate.instant('Nombre'),
      value: '1',
      checked: this.orderSelected === 1
    });
    reorder.addInput({
      type: 'radio',
      label: this.translate.instant('Medida'),
      value: '2',
      checked: this.orderSelected === 2
    });
    reorder.addInput({
      type: 'radio',
      label: this.translate.instant('PasoMedida'),
      value: '3',
      checked: this.orderSelected === 3
    });

    reorder.addButton(this.translate.instant('Cancelar'));
    reorder.addButton({
      text: this.translate.instant('OK'),
      handler: data => {
        this.sortItems(Number.parseInt(data));
      }
    });
    reorder.present();
  }
  /**
   * Event to delete a selected category
   *
   * @param {any} event
   * @param {Category} category
   * @memberof CategorysPage
   */
  deleteCategory(event, category: Category) {
    this.log.logs[this.constructor.name].info('deleteCategory:' + category);
    let confirm = this.alertCtrl.create({
      title: this.translate.instant('Borrando',{value:category.categoryName}),
      message: this.translate.instant('PreguntaBorrarElemento',{value:category.categoryName}),
      buttons: [
        {
          text: this.translate.instant('No'),
          handler: () => {}
        },
        {
          text: this.translate.instant('Si'),
          handler: () => {
            this.categories.splice(this.categories.indexOf(category), 1);
            this.globalVars.setCategoriesData(this.categories);
          }
        }
      ]
    });
    confirm.present();
  }
  /**
   * Event to remove multiple categories
   *
   * @param {string[]} removed
   * @memberof CategorysPage
   */
  removeElements(removed: string[]) {
    this.log.logs[this.constructor.name].info('removeElements:' + removed);
    removed.forEach(categoryRemoved => {
      this.categories = this.categories.filter(
        category => category.categoryName !== categoryRemoved
      );
      this.globalVars.setCategoriesData(this.categories);
    });
  }
  /**
   * Event to add new category
   *
   * @param {any} event
   * @memberof CategorysPage
   */
  addCategory(event) {
    this.log.logs[this.constructor.name].info('addCategory:' + event);
    let newCategory = {
      categoryName: this.translate.instant('NuevaCategoria'),
      icon: {
        src: 'assets/images/icons/default.png'
      },
      measurement: this.measurement,
      unitStep: this.unitStep
    };
    let categoryModal = this.mod.create(CategoryInfoPage, {
      newCategory: newCategory,
      editing:false,
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
            message: this.translate.instant('CategoriaExiste'),
            duration: 1000,
            position: 'bottom'
          });
          toast.present();
        }
      }
    });
    categoryModal.present();
  }
  /**
   * Even to edit a category
   *
   * @param {any} event
   * @param {Category} category
   * @memberof CategorysPage
   */
  editCategory(event, category: Category) {
    this.log.logs[this.constructor.name].info('editCategory:' + category);
    let oldCategory = category.categoryName;
    let edit = this.alertCtrl.create({
      title: this.translate.instant('Edit Category'),
      inputs: [
        {
          name: 'nombreCategory',
          value: oldCategory,
          type: 'text',
          placeholder: this.translate.instant('Nombre')
        }
      ],
      buttons: [
        {
          text: this.translate.instant('Cancelar'),
          role: 'cancel'
        },
        {
          text: this.translate.instant('Confirmar'),
          handler: data => {
            category.categoryName = data.nombreCategory;
            this.globalVars.setCategoriesData(this.categories);
          }
        }
      ]
    });
    edit.present();
  }
  /**
   * Event to change unit step on measurement change
   *
   * @param {any} event
   * @param {Category} category
   * @memberof CategorysPage
   */
  onMeasurementChange(event, category: Category) {
    this.log.logs[this.constructor.name].info(
      'onMeasurementChange:' + category
    );
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
}
