import { Router } from "express";
import { ContenedorDaoProductos } from "../daos/index.js";
import { logger } from "../logger.js";

// Product manager
const productosApi = ContenedorDaoProductos;

const viewsRouter = Router();

viewsRouter.get("/", async (req, res) => {
  if (req.session.passport) {
    logger.info("Acceso a ruta home con usuario registrado");
    res.render("home", { user: req.user.nombre });
  } else {
    logger.info("Acceso a ruta home sin usuario registrado");
    res.render("home", { user: "Invitado" });
  }
});

viewsRouter.get("/productos", async (req, res) => {
  logger.info("Acceso a Ruta productos-test");
  const products = await productosApi.getAll();
  res.render("productos", { products: products });
});

viewsRouter.get("/carrito", (req, res) => {
  //add code to cart view
});

export { viewsRouter };
