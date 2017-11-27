import { ListItem } from '../classes/listItem';
import { Injectable, Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe to filter elements on a list
 *
 * @export
 * @class PipeFilterElements
 * @implements {PipeTransform}
 */
@Pipe({
  name: 'pipefilterElements'
})
@Injectable()
export class PipeFilterElements implements PipeTransform {
  transform(value: any[], args: string): any {
    let aux = [];
    value.forEach(dataValue => {
      if (dataValue.nombreElemento && args) {
        if (dataValue.nombreElemento.toLowerCase() === args.toLowerCase())
          aux.push({
            nombreLista: dataValue.nombreLista,
            cantidadElemento: dataValue.cantidadElemento
          });
      }
    });
    return aux;
  }
}
