import { Component } from '@angular/core';

/**
 * Component to show and manage items near to expire for the dashboard
 * 
 * @export
 * @class ItemsBestBeforeComponent
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
