import { ListItem } from '../classes/listItem';
import { Injectable, Pipe, PipeTransform } from '@angular/core';

/*
  Generated class for the PipeElementLists pipe.

  See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
  Angular 2 Pipes.
*/
@Pipe({
  name: 'pipefilterElements'
})
@Injectable()
export class PipeFilterElements implements PipeTransform {
  transform(value: any[], args: string): any {
    let aux = [];
    value.forEach(dataValue => {
      if (dataValue.nombreElemento.toLowerCase() === args.toLowerCase())
        aux.push({
          nombreLista: dataValue.nombreLista,
          cantidadElemento: dataValue.cantidadElemento
        });
    });
    return aux;
  }
}
