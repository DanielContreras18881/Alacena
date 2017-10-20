import { ListItem } from './listItem';
import { Category } from './category';
/**
 * Class to define a Item object
 * 
 * @export
 * @class Item Class with the item properties
 */
export class Item {
  nombreElemento: string;
  category: Category;
  lists?: ListItem[];
}
