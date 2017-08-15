import { Component } from '@angular/core';

/**
 * Generated class for the CategoryComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'category-component',
  templateUrl: 'category-component.html'
})
export class CategoryComponent {

  text: string;

  constructor() {
    console.log('Hello CategoryComponent Component');
    this.text = 'Hello World';
  }

}
