import express from "express";
//import { chatWebsocket } from "../../server.js";
import {
  ContenedorDaoProductos,
  ContenedorDaoMessages,
} from "../daos/index.js";
import { checkAdminRole } from "../middlewares/isAdmin.js";
import { checkLogin } from "../middlewares/checkLogin.js";
import { options } from "../config/databaseConfig.js";
import { ProductsMock } from "../moks/products.js";
import compression from "compression";
import { logger } from "../logger.js";

// Product manager
const productosApi = ContenedorDaoProductos;

// Product Router
const productsRouter = express.Router();

// Ruta info - process
productsRouter.get("/info", (req, res) => {
  logger.info("Acceso a Ruta info");
  const info = {
    argumentosDeEntrada: process.cwd(),
    plataforma: process.platform,
    nodeVersion: process.version,
    memory: process.memoryUsage(),
    path: process.argv[0],
    id: process.pid,
    carpeta: process.argv[1],
  };
  logger.info(info);
  res.status(200).json(info);
});

// Ruta info Compression
productsRouter.get("/infoCompression", compression(), (req, res) => {
  logger.info("Acceso a Ruta infoCompression");
  const info = {
    argumentosDeEntrada: process.cwd(),
    plataforma: process.platform,
    nodeVersion: process.version,
    memory: process.memoryUsage(),
    path: process.argv[0],
    id: process.pid,
    carpeta: process.argv[1],
  };
  res.status(200).json(info);
});

productsRouter.get("/:id", async (req, res) => {
  const productId = req.params.id;
  const product = await productosApi.getById(productId);
  if (product) {
    return res.send(product);
  } else {
    return res.redirect("/");
  }
});

productsRouter.post("/", checkAdminRole, async (req, res) => {
  const response = await productosApi.save(req.body);
  res.json(response);
});

productsRouter.put("/:id", async (req, res) => {
  logger.info("Acceso a actualizar filtrado por id");
  const cambioObj = req.body;
  const productId = req.params.id;
  const result = await productosApi.updateById(productId, cambioObj);
  res.send(result);
});

productsRouter.delete("/productos/:id", async (req, res) => {
  logger.info("Borrar producto por id");
  const productId = req.params.id;
  const result = await productosApi.deleteById(productId);
  res.send(result);
});

productsRouter.get("*", (req, res) => {
  logger.warn("Se intentó acceder a una ruta inexistente");
  res.redirect("/");
});

//comandos
// curl -X GET "http://localhost:8080/xxx"

//profiling commands
// node --prof server.js

//artillery quick --count 20 -n 50 http://localhost:8080/info > result_info.txt

//compilacion de archivos isolate
// node --prof-process isolate-info.log > result_prof_info.txt

export { productsRouter };
//const productsRandom = new ProductsMock();

/*productsRouter.post("/login", (req, res) => {
  const user = req.body;
  //el usuario existe
  const userExists = users.find((elm) => elm.email === user.email);
  if (userExists) {
    //validar la contrase;a
    if (userExists.password === user.password) {
      req.session.user = user;
      res.redirect("/perfil");
    } else {
      res.redirect("/inicio-sesion");
    }
  } else {
    res.redirect("/registro");
  }
});

// Ruta contar numeros No bloqueante
// ?cant=x     - Query param
productsRouter.get("/randoms", (req, res) => {
  logger.info("Acceso a Ruta randoms");
  let { cant } = req.query;
  if (!cant) {
    cant = 1000000;
  }
  if (cant < 1 || cant > 1e10) {
    logger.error("Parámetro ingresado inválido");
    res.send("Debe ingresar por parámetro un valor entre 1 y 10.000.000.000");
  }
  const child = fork("./child.js");
  //recibimos mensajes del proceso hijo
  child.on("message", (childMsg) => {
    if (childMsg === "listo") {
      //recibimos notificacion del proceso hijo, y le mandamos un mensaje para que comience a operar.
      child.send({ message: "Iniciar", cant: cant });
    } else {
      res.send({ resultado: childMsg });
    }
  });
});
// Rutas Moks
// ?cant=5     - Query param
productsRouter.post("/generar-productos", (req, res) => {
  logger.info("Acceso a Ruta generar-productos");
  const { cant } = req.query;
  let result = productsRandom.populate(parseInt(cant));
  res.send(result);
});*/
