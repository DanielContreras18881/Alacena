import { Component } from '@angular/core';

/**
 * Generated class for the ItemsBestBeforeComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'items-best-before-component',
  templateUrl: 'items-best-before-component.html'
})
export class ItemsBestBeforeComponent {

  text: string;

  constructor() {
    console.log('Hello ItemsBestBeforeComponent Component');
    this.text = 'Hello World';
  }

}
