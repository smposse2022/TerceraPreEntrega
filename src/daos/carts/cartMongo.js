import { ContenedorMongo } from "../../managers/contenedorMongo.js";

class CartDaoMongo extends ContenedorMongo {
  constructor(model) {
    super(model);
  }
}

export { CartDaoMongo };
