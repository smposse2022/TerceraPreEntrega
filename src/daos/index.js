import { options } from "../config/databaseConfig.js";
import { ProductModel } from "../models/productModel.js";
import { CartModel } from "../models/cartModel.js";
import { MessagesModel } from "../models/messagesModel.js";

// generar llave para poder conectarnos de manera segura a nuestra app de Firebase
// Vinculamos esa clave con nuestro serv principal

let ContenedorDaoProductos;
let ContenedorDaoCarritos;
let ContenedorDaoMessages;

//identificador
let databaseType = "mongo";

switch (databaseType) {
  case "archivos":
    const { ProductsDaoArchivos } = await import("./products/productsFiles.js");
    const { CartsDaoArchivos } = await import("./carts/cartsFiles.js");
    ContenedorDaoProductos = new ProductsDaoArchivos(
      options.fileSystem.pathProducts
    );
    ContenedorDaoCarritos = new CartsDaoArchivos(options.fileSystem.pathCarts);
    break;
  case "sql":
    const { ProductosDaoSQL } = await import("./products/productsSql.js");
    const { CarritosDaoSQL } = await import("./carts/cartSql.js");
    ContenedorDaoProductos = new ProductosDaoSQL(options.sqliteDb, "productos");
    ContenedorDaoCarritos = new CarritosDaoSQL(options.sqliteDb, "carritos");
    break;
  case "mongo":
    const { ProductsDaoMongo } = await import("./products/productsMongo.js");
    const { CartDaoMongo } = await import("./carts/cartMongo.js");
    const { MessagesDaoMongo } = await import("./messages/messagesMongo.js");
    ContenedorDaoProductos = new ProductsDaoMongo(ProductModel);
    ContenedorDaoCarritos = new CartDaoMongo(CartModel);
    ContenedorDaoMessages = new MessagesDaoMongo(MessagesModel);
    break;
  /*case "firebase":
    const { ProductsDaoFirebase } = await import(
      "./products/productsFirebase.js"
    );
    const { CartDaoFirebase } = await import("./carts/cartsFirebase.js");
    ContenedorDaoProductos = new ProductsDaoFirebase("Productos");
    ContenedorDaoCarritos = new CartDaoFirebase("Carritos");
    break;*/
}

export { ContenedorDaoProductos, ContenedorDaoCarritos, ContenedorDaoMessages };
