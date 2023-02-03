import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const options = {
  fileSystem: {
    pathProducts: "Products.json",
    pathCarts: "Carritos.json",
    pathMessages: "Messages.json",
  },
  /*mariaDb: {
    client: "mysql",
    connection: {
      host: "127.0.0.1",
      user: "root",
      password: "",
      database: "desafiosql",
    },
  },
  */ sqliteDb: {
    client: "sqlite3",
    connection: {
      filename: path.join(__dirname, "../db/database.sqlite"),
    },
    useNullAsDefault: true,
  },
  mongo: {
    url: "mongodb+srv://smposse:coderMongo2022@cluster0.94d5car.mongodb.net/ecommerceDB?retryWrites=true&w=majority",
  },
  /*firebase: {
    pathProducts: productCollection,
    pathCarts: cartCollection,
  },*/
};
