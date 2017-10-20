import { Category } from './category';
/**
 * Class to define a ListItem object
 * 
 * @export
 * @class ListItem Class with the listItem properties
 */
export class ListItem {
  category: Category;
  nombreElemento: string;
  colorElemento: string;
  colorBotones: string;
  nombreLista: string;
  cantidadElemento: number;
  caduca: boolean;
  fechaCaducidad: string;
  cantidadMinima: number;
  marked: boolean;
}
