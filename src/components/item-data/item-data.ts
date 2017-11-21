import { Icon } from '../../classes/icon';
import { ListItem } from '../../classes/listItem';
import { List } from '../../classes/list';
import moment from 'moment';
import { ToastController, AlertController } from 'ionic-angular';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import { OnInit } from '@angular/core/public_api';
import { AutoCompleteComponent } from 'ionic2-auto-complete';

import { CategoriesService } from '../../providers/categories/categoriesService';
import { ItemsOnList } from './items-on-list';

/**
 * Component to show a form for a item of a list, in a modal window
 * 
 * @export
 * @class Item
 * @implements {OnInit}
 */
@Component({
  selector: 'item',
  templateUrl: 'item-data.html',
  inputs: ['item', 'creating'],
  providers: [CategoriesService, ItemsOnList]
})
export class Item implements OnInit {
  @Input() item: ListItem;
  @Input() creating: boolean;
  @Input() icons: Icon[];
  @Input() config: any;
  @Output() remove: EventEmitter<ListItem> = new EventEmitter();
  @Output() move: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<ListItem> = new EventEmitter();
  @Output() save: EventEmitter<ListItem> = new EventEmitter();

  @ViewChild('searchbar') searchbar: AutoCompleteComponent;

  oldMeasurement: string = '';

  constructor(
    private catService: CategoriesService,
    public alertCtrl: AlertController,
    public itemsOnList: ItemsOnList,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.oldMeasurement = this.item.category.measurement;
  }
  /**
	 * Event to change measurement when unit step is changed
	 * 
	 * @param {any} measurement 
	 * @memberof Item
	 */
  changeUnitStep(measurement) {
    if (measurement === 'UNIDADES') {
      this.item.category.unitStep = 1;
      if (this.creating || measurement !== this.oldMeasurement) {
        this.item.cantidadElemento = 1;
        this.item.cantidadMinima = 1;
      }
    } else if (measurement === 'GRAMOS') {
      this.item.category.unitStep = 100;
      if (this.creating || measurement !== this.oldMeasurement) {
        this.item.cantidadElemento = 100;
        this.item.cantidadMinima = 100;
      }
    } else if (measurement === 'LITROS') {
      this.item.category.unitStep = 0.25;
      if (this.creating || measurement !== this.oldMeasurement) {
        this.item.cantidadElemento = 1;
        this.item.cantidadMinima = 1;
      }
    } else {
      this.item.category.unitStep = 0.5;
      if (this.creating || measurement !== this.oldMeasurement) {
        this.item.cantidadElemento = 1;
        this.item.cantidadMinima = 1;
      }
    }
    this.oldMeasurement = this.item.category.measurement;
    this.save.emit(this.item);
  }
  /**
	 * Event change on a new unit step selected
	 * 
	 * @param {any} event 
	 * @memberof Item
	 */
  onChange(event) {
    this.changeUnitStep(this.item.category.measurement);
  }
  /**
	 * Event on plus button pushed
	 * 
	 * @param {any} event 
	 * @param {any} amount 
	 * @memberof Item
	 */
  plusElement(event, amount) {
    if (amount) {
      let added: number =
        this.item.cantidadElemento + this.item.category.unitStep;
      this.item.cantidadElemento = Math.round(added * 100) / 100;
    } else {
      let added: number =
        this.item.cantidadMinima + this.item.category.unitStep;
      this.item.cantidadMinima = Math.round(added * 100) / 100;
    }
    this.save.emit(this.item);
  }
  /**
		* Event on minus button pushed
		* 
		* @param {any} event 
		* @param {any} amount 
		* @memberof Item
	   */
  minusElement(event, amount) {
    if (amount) {
      let removed: number =
        this.item.cantidadElemento - this.item.category.unitStep;
      if (removed > this.item.cantidadMinima) {
        this.item.cantidadElemento = removed;
        this.save.emit(this.item);
      } else {
        if (removed <= this.item.cantidadMinima && removed > 0) {
          if (this.config.askAddListaCompra) {
            this.item.cantidadElemento = removed;
            this.save.emit(this.item);
            let confirm = this.alertCtrl.create({
              title: 'Not enough ' + this.item.nombreElemento + '',
              message:
                'Do you like to move ' +
                this.item.nombreElemento +
                ' to SHOPPING_LIST?',
              buttons: [
                {
                  text: 'No',
                  handler: () => {}
                },
                {
                  text: 'Yes',
                  handler: () => {
                    let newItem: List = JSON.parse(JSON.stringify(this.item));
                    newItem.nombreLista = 'LISTA_COMPRA';
                    this.move.emit({ item: newItem, toShopingList: true });
                  }
                }
              ]
            });
            confirm.present();
          } else {
            this.item.cantidadElemento = removed;
            this.save.emit(this.item);
          }
        } else if (removed <= 0) {
          if (this.config.deleteAt0) {
            this.remove.emit(this.item);
          } else {
            this.item.cantidadElemento = 0;
            this.save.emit(this.item);
          }
        }
      }
    } else {
      let removed: number =
        this.item.cantidadMinima - this.item.category.unitStep;
      if (removed < 0) this.item.cantidadMinima = 0;
      else this.item.cantidadMinima = removed;
      this.save.emit(this.item);
    }
  }
  /**
	 * Check if the expiry date needs to be shown
	 * 
	 * @param {ListItem} item 
	 * @memberof Item
	 */
  showExpiryDate(item: ListItem) {
    let text = this.checkExpiryDate(item.fechaCaducidad);
    // TODO: Translate text variable
    const toast = this.toastCtrl.create({
      message:
        item.nombreElemento +
        ' ' +
        text +
        ' ' +
        moment(item.fechaCaducidad).format('DD/MMM/YYYY'),
      duration: 2500,
      position: 'top',
      cssClass: 'expiryWarning'
    });
    toast.present();
  }
  newExpire() {
    if(this.item.caduca) this.item.fechaCaducidad = new Date().toISOString();
  }
  /**
	* Check expiry date of the item
	* 
	* @param {any} expiryDate 
	* @returns 
	* @memberof Item
	*/
  checkExpiryDate(expiryDate) {
    if (moment().isAfter(moment(expiryDate, 'YYYY-MM-DDTHH:mm:ss.SSSZ'))) {
      return 'expired';
    } else {
      if (
        moment().isAfter(
          moment(expiryDate, 'YYYY-MM-DDTHH:mm:ss.SSSZ').subtract(7, 'days')
        )
      ) {
        return 'nearToExpire';
      } else {
        return 'onTime';
      }
    }
  }
  /**
	 * Mark item on the shopping list
	 * 
	 * @param {any} event 
	 * @memberof Item
	 */
  markItem(event) {
    this.item.marked = !this.item.marked;
    this.save.emit(this.item);
  }
  /**
	 * Edit item event
	 * 
	 * @param {any} event 
	 * @memberof Item
	 */
  editItem(event) {
    this.edit.emit(this.item);
  }
  /**
	 * Remove item event
	 * 
	 * @param {any} event 
	 * @memberof Item
	 */
  removeItem(event) {
    this.remove.emit(this.item);
  }
  /**
	 * Move item event
	 * 
	 * @param {any} event 
	 * @memberof Item
	 */
  moveItem(event) {
    this.move.emit({ item: this.item, toShopingList: false });
  }
  /**
	 * Event to edit category of the item
	 * 
	 * @param {any} event 
	 * @memberof Item
	 */
  editCategory(event) {
    this.catService.changeCategory(this.item.category, this.item).then(data => {
      this.item = <ListItem>data;
      this.changeUnitStep(this.item.category.measurement);
    });
  }
  /**
	* Event on selected result on the search input results
	* 
	* @param {any} event 
	* @memberof Item
	*/
  seleccionado(event) {
    if (event) {
      this.item.nombreElemento = event.nombreElemento;
    } else {
      this.item.nombreElemento = this.searchbar.getValue();
    }
  }
}
