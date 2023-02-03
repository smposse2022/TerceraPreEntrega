import { ContenedorSql } from "../../managers/contenedorSql.js";

class ProductosDaoSQL extends ContenedorSql {
  constructor(options, tableName) {
    super(options, tableName);
  }
}

export { ProductosDaoSQL };
