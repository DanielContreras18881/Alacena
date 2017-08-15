import {Component} from '@angular/core';

import {ViewController, NavParams} from 'ionic-angular';

import {CategoriesService} from '../../providers/categories/categoriesService';

/*
  Generated class for the CategoryInfoPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'category-info.html',
  providers: [CategoriesService]
})
export class CategoryInfoPage {
  category: any;
  icons: any;

  constructor(
      private view: ViewController,
      private catService: CategoriesService,
      public params: NavParams) {}

  ngOnInit() {
    this.category = this.params.get('newCategory');
    this.icons = this.params.get('icons');
  }

  changeCategoryIcon(event, category) {
    this.catService.changeCategoryIcon(category, this.icons);
  }

  measurementChange(event) {
    // TODO: Save data to storage, needed?
    console.log(JSON.stringify(event));
  }

  save() {
      this.view.dismiss(this.category);
  }

  close() {
      this.view.dismiss();
  }
}
