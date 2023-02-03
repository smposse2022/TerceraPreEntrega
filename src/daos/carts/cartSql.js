import { ContenedorSql } from "../../managers/contenedorSql.js";

class CarritosDaoSQL extends ContenedorSql {
  constructor(options, tableName) {
    super(options, tableName);
  }
}

export { CarritosDaoSQL };
