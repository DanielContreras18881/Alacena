import {Component, Input, Output, EventEmitter} from '@angular/core';

import {GlobalVars} from '../../providers/global-vars/global-vars';

import {CategoriesService} from '../../providers/categories/categoriesService';
/*
  Generated class for the ItemData component.

  See https://angular.io/docs/ts/latest/api/core/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'item-data',
  templateUrl: 'item-data.html',
  inputs: ['item', 'creating'],
  providers: [CategoriesService]
  // outputs: ['remove', 'move', 'edit']
})
export class ItemData {
  @Input() item: any;
  @Input() creating: boolean;
  @Input() icons: any;
  @Output() remove: EventEmitter<any> = new EventEmitter();
  @Output() move: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();

  unitStep: number = 0.1;

  constructor(private catService: CategoriesService, private globalVars: GlobalVars) {}

  changeUnitStep(measurement) {
    if (measurement === 'UNIDADES') {
      this.item.category.unitStep = 0.1;
      if (this.creating) {
        this.item.cantidadElemento = 1;
        this.item.cantidadMinima = 1;
      }
    } else if (measurement === 'GRAMOS') {
      this.item.category.unitStep = 100;
      if (this.creating) {
        this.item.cantidadElemento = 100;
        this.item.cantidadMinima = 100;
      }
    } else if (measurement === 'LITROS') {
      this.item.category.unitStep = 0.5;
      if (this.creating) {
        this.item.cantidadElemento = 1;
        this.item.cantidadMinima = 1;
      }
    } else {
      this.item.category.unitStep = 0.5;
      if (this.creating) {
        this.item.cantidadElemento = 1;
        this.item.cantidadMinima = 1;
      }
    }
  }

  onChange(event) {
    this.changeUnitStep(this.item.category.measurement);
  }

  plusElement(event, amount) {
    if (amount) {
      let added: number = this.item.cantidadElemento + this.unitStep;
      this.item.cantidadElemento = Math.round(added * 100) / 100;
    } else {
      let added: number = this.item.cantidadMinima + this.unitStep;
      this.item.cantidadMinima = Math.round(added * 100) / 100;
    }
  }
  minusElement(event, amount) {
    if (amount) {
      let removed: number = this.item.cantidadElemento - this.item.category.unitStep;
      if (removed >= 0) this.item.cantidadElemento = Math.round(removed * 100) / 100;
    }else {
      let removed: number = this.item.cantidadMinima - this.item.category.unitStep;
      if (removed >= 0) this.item.cantidadMinima = Math.round(removed * 100) / 100;
    }
  }
// TODO: check these functions, their need and their functionality

  markItem(event) {
    console.log('markItem');
    this.item.marked = !this.item.marked;
  }

  editItem(event) {
    console.log('editItem:' + JSON.stringify(this.item));
    this.edit.emit(event);
  }

  removeItem(event) {
    console.log('removeItem');
    this.remove.emit(event);
  }

  moveItem(event) {
    console.log('moveItem');
    this.move.emit(event);
  }

// TODO: request action to do on the category change,unitstep and measurement...do not change amounts
  editCategory(event) {
    this.catService.changeCategory(this.item.category, this.item);
  }

}
