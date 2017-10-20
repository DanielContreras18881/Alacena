import { Icon } from '../../classes/icon';
import { Category } from '../../classes/category';
import { Component } from '@angular/core';

import { ViewController, NavParams } from 'ionic-angular';

import { CategoriesService } from '../../providers/categories/categoriesService';
/**
 * Category Info Page to add a Category, in a modal window
 * 
 * @export
 * @class CategoryInfoPage
 */
@Component({
  templateUrl: 'category-info.html',
  providers: [CategoriesService]
})
export class CategoryInfoPage {
  category: Category;
  icons: Icon[];

  constructor(
    private view: ViewController,
    private catService: CategoriesService,
    public params: NavParams
  ) {}

  ngOnInit() {
    this.category = this.params.get('newCategory');
    this.icons = this.params.get('icons');
  }
  /**
	 * Change category event
	 * 
	 * @param {any} event 
	 * @param {Category} category 
	 * @memberof CategoryInfoPage
	 */
  changeCategoryIcon(event, category: Category) {
    this.catService.changeCategoryIcon(category, this.icons);
  }
  /**
	 * Change measurement type event
	 * 
	 * @param {any} event 
	 * @memberof CategoryInfoPage
	 */
  measurementChange(event) {
    if (this.category.measurement === 'UNIDADES') {
      this.category.unitStep = 0.1;
    } else if (this.category.measurement === 'GRAMOS') {
      this.category.unitStep = 100;
    } else if (this.category.measurement === 'LITROS') {
      this.category.unitStep = 0.5;
    } else {
      this.category.unitStep = 0.5;
    }
  }
  /**
	 * Close the modal window, saving changes
	 * 
	 * @memberof CategoryInfoPage
	 */
  save() {
    this.view.dismiss(this.category);
  }
  /**
	 * Close the modal window, discarding changes
	 * 
	 * @memberof CategoryInfoPage
	 */
  close() {
    this.view.dismiss();
  }
}
