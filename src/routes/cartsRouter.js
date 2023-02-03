import express from "express";
import { checkAdminRole } from "../middlewares/isAdmin.js";
import { options } from "../config/databaseConfig.js";
//import { ContenedorArchivos } from "../managers/contenedorArchivos.js";
//import { ContenedorSql } from "../managers/ContenedorSql.js";
import {
  ContenedorDaoProductos,
  ContenedorDaoCarritos,
} from "../daos/index.js";

//manager carritos
// const listaProductos = new ContenedorArchivos (options.fileSystem.pathProducts);
// const listaCarritos = new ContenedorArchivos (options.fileSystem.pathCarts);
// const listaProductos = new ContenedorSql(options.sqliteDB, "productos");
// const listaCarritos = new ContenedorSql(options.sqliteDB, "carritos");
const listaProductos = ContenedorDaoProductos;
const listaCarritos = ContenedorDaoCarritos;

//router carritos
const cartsRouter = express.Router();

cartsRouter.get("/", async (req, res) => {
  const response = await listaCarritos.getAll();
  res.json(response);
});

cartsRouter.post("/", async (req, res) => {
  const response = await listaCarritos.save();
  res.json(response);
});

cartsRouter.delete("/:id", async (req, res) => {
  const cartId = parseInt(req.params.id);
  res.json(await listaCarritos.deleteById(cartId));
});

cartsRouter.get("/:id/productos", async (req, res) => {
  const cartId = parseInt(req.params.id);
  const carritoResponse = await listaCarritos.getById(cartId);
  if (carritoResponse.error) {
    res.json(carritoResponse);
  } else {
    const getData = async () => {
      const products = await Promise.all(
        carritoResponse.message.products.map(async (element) => {
          const productResponse = await listaProductos.getById(element);
          return productResponse.message;
        })
      );
      res.json({ products: products });
    };
    getData();
  }
});

cartsRouter.post("/:id/productos", async (req, res) => {
  const cartId = parseInt(req.params.id);
  const productId = parseInt(req.body.id);
  const carritoResponse = await listaCarritos.getById(cartId);
  if (carritoResponse.error) {
    res.json({ message: `El carrito con id: ${cartId} no fue encontrado` });
  } else {
    const productoResponse = await listaProductos.getById(productId);
    if (productoResponse.error) {
      res.json(productoResponse);
    } else {
      carritoResponse.message.products.push(productoResponse.message.id);
      const response = await listaCarritos.updateById(
        carritoResponse.message,
        cartId
      );
      res.json({ message: "product added" });
    }
  }
});

cartsRouter.delete("/:id/productos/:idProd", async (req, res) => {
  const cartId = parseInt(req.params.id);
  const productId = parseInt(req.params.idProd);
  const carritoResponse = await carritosApi.getById(cartId);
  if (carritoResponse.error) {
    res.json({ message: `El carrito con id: ${cartId} no fue encontrado` });
  } else {
    const index = carritoResponse.message.products.findIndex(
      (p) => p === productId
    );
    if (index !== -1) {
      carritoResponse.message.products.splice(index, 1);
      await carritosApi.updateById(carritoResponse.message, cartId);
      res.json({ message: "product deleted" });
    } else {
      res.json({
        message: `El producto no se encontro en el carrito: ${productId}`,
      });
    }
  }
});

export { cartsRouter };
