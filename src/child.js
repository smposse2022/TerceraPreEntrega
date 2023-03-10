import { numerosAlAzar } from "./helpers/operaciones.js";
import { logger } from "./logger.js";

//solo cuando trabajemos con modulos de es6
process.send("listo"); //proceso hijo listo para trabajar

////recibimos los mensajes del proceso padre.
process.on("message", (parentMsg) => {
  // console.log("parentMsg", parentMsg);
  logger.info(parentMsg);
  if (parentMsg.message === "Iniciar") {
    const resultadoFinal = numerosAlAzar(parentMsg.cant);
    //enviamos el resultado de la operacion del proceso hijo al proceso padre
    process.send(resultadoFinal);
  }
});
