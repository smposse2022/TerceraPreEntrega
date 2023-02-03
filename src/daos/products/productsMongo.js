import { ContenedorMongo } from "../../managers/contenedorMongo.js";

class ProductsDaoMongo extends ContenedorMongo {
  constructor(model) {
    super(model);
  }
}

export { ProductsDaoMongo };
