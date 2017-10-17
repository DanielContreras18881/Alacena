import { ListItem } from './listItem';
import { Category } from './category';
export class Item {
  nombreElemento: string;
  category: Category;
  lists?: ListItem[];
}
