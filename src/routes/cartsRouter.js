import express from "express";
import { checkAdminRole } from "../middlewares/isAdmin.js";
import { options } from "../config/databaseConfig.js";
//import { ContenedorArchivos } from "../managers/contenedorArchivos.js";
//import { ContenedorSql } from "../managers/ContenedorSql.js";
import {
  ContenedorDaoProductos,
  ContenedorDaoCarritos,
} from "../daos/index.js";

const productosApi = ContenedorDaoProductos;
const carritosApi = ContenedorDaoCarritos;

//router carritos
const cartsRouter = express.Router();

cartsRouter.get("/", async (req, res) => {
  const response = await carritosApi.getAll();
  res.json(response);
});
/*if (req.user) {
  console.log(req.user);
  res.send(`Hola ${req.user._id}`);
} else {
  res.send("Chau");
}*/

cartsRouter.post("/", async (req, res) => {
  const response = await carritosApi.save({
    products: [],
    timestamp: new Date().toLocaleDateString(),
  });
  res.json(response);
});

cartsRouter.delete("/:id", async (req, res) => {
  const cartId = req.params.id;
  res.json(await carritosApi.deleteById(cartId));
});

cartsRouter.get("/:id/productos", async (req, res) => {
  const cartId = req.params.id;
  const carritoResponse = await carritosApi.getById(cartId);
  if (carritoResponse.error) {
    res.json(carritoResponse);
  } else {
    const getData = async () => {
      const products = await Promise.all(
        carritoResponse.message.products.map(async (element) => {
          const productResponse = await productosApi.getById(element);
          return productResponse.message;
        })
      );
      res.json({ products: products });
    };
    getData();
  }
});

cartsRouter.post("/:id/productos", async (req, res) => {
  const cartId = req.params.id;
  const productId = req.body.id;
  const carritoResponse = await carritosApi.getById(cartId);
  if (carritoResponse.error) {
    res.json({ message: `El carrito con id: ${cartId} no fue encontrado` });
  } else {
    const productoResponse = await productosApi.getById(productId);
    if (productoResponse.error) {
      res.json(productoResponse);
    } else {
      carritoResponse.message.products.push(productoResponse.message.id);
      const response = await carritosApi.updateById(
        carritoResponse.message,
        cartId
      );
      res.json({ message: "product added" });
    }
  }
});

cartsRouter.delete("/:id/productos/:idProd", async (req, res) => {
  const cartId = req.params.id;
  const productId = req.params.idProd;
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
