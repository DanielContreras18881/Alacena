/**
 * Class to define a Category object
 *
 * @export
 * @class Category Class with the category properties
 */
export class Category {
  categoryName: string;
  icon: Icon;
  measurement: string;
  unitStep: number;
}

class Icon {
  src: string
}
