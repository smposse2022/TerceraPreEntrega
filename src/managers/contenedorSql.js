import knex from "knex";
import { logger } from "../logger.js";

class ContenedorSql {
  constructor(options, tableName) {
    this.database = knex(options);
    this.tableName = tableName;
  }
  getAll = async () => {
    try {
      // select * desde la tabla
      const data = await this.database.from(this.tableName).select("*");
      const result = data.map((elm) => ({ ...elm }));
      return result;
    } catch (error) {
      logger.error(error);
    }
  };

  save = async (newItem) => {
    try {
      await this.database.from(this.tableName).insert(newItem);
      return `new item saved`;
    } catch (error) {
      logger.error(error);
    }
  };

  getById = async (id) => {
    try {
      const result = await this.database.from(this.tableName).where("id", id);
      return result;
      /*.then((result) => {
          const productoElegido = result.map((element) => ({ ...element }));
          console.log(productoElegido);
        })*/
    } catch (error) {
      logger.error(error);
    }
  };

  deleteById = async (id) => {
    try {
      const itemsSinElEliminado = await this.database
        .from(this.tableName)
        .where("id", id)
        .del();
      return itemsSinElEliminado;
    } catch (error) {
      logger.error(error);
    }
  };

  deleteAll = async () => {
    try {
      await this.database.from(this.tableName).select("*").del();
    } catch (error) {
      logger.error(error);
    }
  };

  updateById = async (id, body) => {
    try {
      await this.database
        .from(this.tableName)
        .where("id", id)
        .update({ body: body });
    } catch (error) {
      console.log(error);
    }
  };
}

export { ContenedorSql };
