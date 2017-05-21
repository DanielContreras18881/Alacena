import { Component } from '@angular/core';

/**
 * Generated class for the ItemComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'item-component',
  templateUrl: 'item-component.html'
})
export class ItemComponent {

  text: string;

  constructor() {
    console.log('Hello ItemComponent Component');
    this.text = 'Hello World';
  }

}
