import { Category } from './category';
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
