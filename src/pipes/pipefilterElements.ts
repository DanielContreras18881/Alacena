import {Injectable, Pipe, PipeTransform} from '@angular/core';

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
  /*
    Takes a value and makes it lowercase.
   */
  transform(value: any[], args: any[]): any {
    if ( value !== undefined ) {
      return value.filter(valueData => valueData.nombreElemento === args);
    } else {
      return [];
    }
  }
}
