import { Pipe, PipeTransform } from '@angular/core';
import * as _ from "lodash";
/**
 * Generated class for the OrderPipe pipe.
 *
 * See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
 * Angular Pipes.
 */
@Pipe({
  name: 'order-pipe',
})
export class OrderPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: any[], ...args) {
	  console.log(value)
	  console.log(args)
    return _.sortBy(value, args);
  }
}
