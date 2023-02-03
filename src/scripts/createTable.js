import { options } from "../config/databaseConfig.js";
import knex from "knex";
import { logger } from "../logger.js";
const dbmsql = knex(options.mariaDb);
const dbsqlite = knex(options.sqliteDb);

const createTables = async () => {
  try {
    // validamos si la tabla de datos de productos ya existe en la base de datos
    const tableProductExists = await dbmsql.schema.hasTable("products");
    if (tableProductExists) {
      await dbmsql.schema.dropTable("products");
    }
    // creamos la tabla de productos
    await dbmsql.schema.createTable("products", (table) => {
      // definimos los campos de la tabla products
      table.increments("id");
      table.string("title", 40).nullable(false);
      table.integer("price").nullable(false);
      table.integer("thumbnail", 200).nullable(false);
    });
    logger.info("products table created");
    dbmsql.destroy();
    // validamos si la tabla de datos ya existe en la base de datos
    const tableMessagesExists = await dbsqlite.schema.hasTable("messages");
    if (tableMessagesExists) {
      await dbsqlite.schema.dropTable("messages");
    }
    await dbsqlite.schema.createTable("messages", (table) => {
      table.increments("id");
      table.string("username", 100).nullable(false);
      table.string("message", 100).nullable(false);
      table.string("timestamp", 500).nullable(false);
    });
    logger.info("messages table created");
    dbsqlite.destroy();
  } catch (error) {
    logger.error(error);
  }
};
createTables();
