import mongoose from "mongoose";
import { logger } from "../logger.js";
import { options } from "../config/databaseConfig.js";

mongoose.set("strictQuery", false);
mongoose.connect(options.mongo.url, (err) => {
  if (err)
    return logger.error(`Hubo un error al conectar la base de datos ${err}`);
  logger.info("Base de datos conectada");
});

class ContenedorMongo {
  constructor(model) {
    this.model = model;
  }

  async getById(id) {
    try {
      const response = await this.model.findById(id);
      const data = JSON.parse(JSON.stringify(response)); //convertir a formato json
      return data;
    } catch (error) {
      throw new Error(`Hubo un error ${error}`);
    }
  }

  async getByUserId(id) {
    try {
      const response = await this.model.find({ userId: id });
      const data = JSON.parse(JSON.stringify(response)); //convertir a formato json
      return data;
    } catch (error) {
      throw new Error(`Hubo un error ${error}`);
    }
  }

  async getAll() {
    try {
      const response = await this.model.find();
      const data = JSON.parse(JSON.stringify(response));
      return data;
    } catch (error) {
      throw new Error(`Hubo un error ${error}`);
    }
  }

  async save(body) {
    try {
      const response = await this.model.create(body);
      const data = JSON.parse(JSON.stringify(response));
      return data;
    } catch (error) {
      throw new Error(`Error al guardar: ${error}`);
    }
  }

  async updateById(body, id) {
    try {
      await this.model.findByIdAndUpdate(id, body, { new: true });
      return "Update successfully";
    } catch (error) {
      throw new Error(`Error al actualizar: no se encontró el id ${id}`);
    }
  }

  async deleteById(id) {
    try {
      await this.model.findByIdAndDelete(id);
      return "delete successfully";
    } catch (error) {
      throw new Error(`Error al borrar: no se encontró el id ${id}`);
    }
  }

  async deleteAll() {
    try {
      await this.model.deleteMany({});
      return "delete All successfully";
    } catch (error) {
      throw new Error(`Error al borrar todo: ${error}`);
    }
  }
}

export { ContenedorMongo };
