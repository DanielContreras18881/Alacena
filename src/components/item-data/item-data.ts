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

/*
  Generated class for the ItemData component.

  See https://angular.io/docs/ts/latest/api/core/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'item',
  templateUrl: 'item-data.html',
  inputs: ['item', 'creating'],
  providers: [CategoriesService, ItemsOnList]
  // outputs: ['remove', 'move', 'edit']
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

  onChange(event) {
    this.changeUnitStep(this.item.category.measurement);
  }

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
  // TODO: check these functions, their need and their functionality

  markItem(event) {
    console.log('markItem');
    this.item.marked = !this.item.marked;
    this.save.emit(this.item);
  }

  editItem(event) {
    console.log('editItem:' + JSON.stringify(this.item));
    this.edit.emit(this.item);
  }

  removeItem(event) {
    console.log('removeItem');
    this.remove.emit(this.item);
  }

  moveItem(event) {
    console.log('moveItem');
    this.move.emit({ item: this.item, toShopingList: false });
  }

  editCategory(event) {
    this.catService.changeCategory(this.item.category, this.item).then(data => {
      this.item = <ListItem>data;
      this.changeUnitStep(this.item.category.measurement);
    });
  }
  seleccionado(event) {
    if (event) {
      this.item.nombreElemento = event.nombreElemento;
    } else {
      this.item.nombreElemento = this.searchbar.getValue();
    }
  }
}
