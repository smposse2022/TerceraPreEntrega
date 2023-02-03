import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { logger } from "../logger";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ContenedorArchivos {
  constructor(nameFile) {
    this.nameFile = path.join(__dirname, `../files/${nameFile}`);
  }
  getAll = async () => {
    try {
      const contenido = await fs.promises.readFile(this.nameFile, "utf-8");
      const productos = JSON.parse(contenido);
      return productos;
    } catch (error) {
      logger.error(error);
    }
  };

  getById = async (id) => {
    try {
      if (fs.existsSync(this.nameFile)) {
        const contenido = await fs.promises.readFile(this.nameFile, "utf-8");
        if (contenido) {
          const productos = JSON.parse(contenido);
          const producto = productos.find((item) => item.id === id);
          return producto;
        } else {
          return "El archivo está vacío";
        }
      }
    } catch (error) {
      logger.error(error);
    }
  };

  save = async (product) => {
    try {
      // Leer si el archivo existe
      if (fs.existsSync(this.nameFile)) {
        const contenido = await fs.promises.readFile(this.nameFile, "utf-8");
        if (contenido) {
          const productos = JSON.parse(contenido);
          // Verificar si el producto ya existe en el archivo
          const newProduct = {
            id: productos.length + 1,
            ...product,
          };
          productos.push(newProduct);
          await fs.promises.writeFile(
            this.nameFile,
            JSON.stringify(productos, null, 2)
          );
        } else {
          const newProduct = {
            id: 1,
            ...product,
          };
          // Creamos el archivo
          await fs.promises.writeFile(
            this.nameFile,
            JSON.stringify([newProduct], null, 2)
          );
        }
      } else {
        const newProduct = {
          id: 1,
          ...product,
        };
        // Creamos el archivo
        await fs.promises.writeFile(
          this.nameFile,
          JSON.stringify([newProduct], null, 2)
        );
      }
    } catch (error) {
      logger.error(error);
    }
  };

  deleteById = async (id) => {
    const contenido = await fs.promises.readFile(this.nameFile, "utf-8");
    const productos = JSON.parse(contenido);
    const productoSinElBorrado = productos.filter((item) => item.id !== id);
    await fs.promises.writeFile(
      this.nameFile,
      JSON.stringify(productoSinElBorrado, null, 2)
    );
  };

  deleteAll = async () => {
    await fs.promises.writeFile(this.nameFile, JSON.stringify([], null, 2));
  };

  updateById = async (id, body) => {
    try {
      const productos = await this.getAll();
      const productPos = productos.findIndex((el) => el.id === id);
      productos[productPos] = {
        id: id,
        ...body,
      };
      await fs.promises.writeFile(
        this.nameFile,
        json.stringify(productos, null, 2)
      );
      return productos;
    } catch (error) {
      console.log(error);
    }
  };
}

export { ContenedorArchivos };
