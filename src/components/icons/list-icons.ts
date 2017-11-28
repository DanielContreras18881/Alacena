import { Component } from '@angular/core';

import { ViewController, NavController, NavParams } from 'ionic-angular';

/**
 * Component to show a list of icons to choose, on a modal window
 *
 * @export
 * @class ListIconsPage
 */
@Component({
  templateUrl: 'list-icons.html'
})
export class ListIconsPage {
  icons: string[];
  selectedIcon: string;
  constructor(
    public nav: NavController,
    private view: ViewController,
    public params: NavParams
  ) {}

  ngOnInit() {
    this.icons = this.params.get('icons');
    this.selectedIcon = '';
  }
  /**
   * Selected icon event
   *
   * @param {any} event
   * @param {any} icon
   * @memberof ListIconsPage
   */
  selected(event, icon) {
    this.selectedIcon = icon;
    this.view.dismiss(this.selectedIcon);
  }
  /**
   * Close modal window
   *
   * @memberof ListIconsPage
   */
  close() {
    this.view.dismiss();
  }
}
