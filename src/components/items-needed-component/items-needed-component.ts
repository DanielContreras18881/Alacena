import { Component } from '@angular/core';

/**
 * Component to show and manage items needed to shop on the dashboard
 * 
 * @export
 * @class ItemsNeededComponent
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
