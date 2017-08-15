import { Component } from '@angular/core';

/**
 * Generated class for the ItemsNeededComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'items-needed-component',
  templateUrl: 'items-needed-component.html'
})
export class ItemsNeededComponent {

  text: string;

  constructor() {
    console.log('Hello ItemsNeededComponent Component');
    this.text = 'Hello World';
  }

}
