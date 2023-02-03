/*import { json } from "express";
import admin from "firebase-admin";
import { readFileSync } from "fs";
// generar llave para poder conectarnos de manera segura a nuestra app de Firebase
// Vinculamos esa clave con nuestro serv principal
/*const serviceAccount = JSON.parse(readFileSync("../FirebaseKey.json"));
console.log(serviceAccount);
//import serviceAccount from "../FirebaseKey.json" assert { type: "json" };

// Inicializamos Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://coderbackend-818d2.firebaseio.com",
});
console.log("Base conectada");

// generar una instancia de la base de datos
const db = admin.firestore();
// definir la colección con la que vamos a trabajar
export const productCollection = db.collection("Productos");
export const cartCollection = db.collection("Carritos");

class ContenedorFirebase {
  constructor(collection) {
    this.collection = db.collection(collection);

    //const doc = this.collection.doc();
  }
  getAll = async () => {
    // Ver, porque sólo lee los campos programados para productos, no Carrito
    try {
      let response = await this.collection.doc().get();
      console.log("hola", response);
      let docs = response.docs;
      let items = docs.map((doc) => ({
        id: doc.id,
        title: doc.data().title,
        description: doc.data().description,
        codigo: doc.data().codigo,
        price: doc.data().price,
        thumbnail: doc.data().thumbnail,
        stock: doc.data().stock,
      }));
      console.log(items);
      return items;
    } catch (error) {
      console.log(error);
    }
  };

  save = async (newItem) => {
    try {
      const doc = this.collection.doc();
      await doc.create({ newItem });
      console.log("item created");
      return `new item saved`;
    } catch (error) {
      console.log(error);
    }
  };

  getById = async (id) => {
    try {
      let response = await this.collection.get();
      let docs = response.docs;
      let itemSelected = docs.find((doc) => doc.id == id);
      console.log(itemSelected);
      return itemSelected;
    } catch (error) {
      console.log(error);
    }
  };

  updateById = async (id, body) => {
    try {
      const itemUpdated = this.collection.doc(id);
      await itemUpdated.update({ body });
      console.log(itemUpdated);
      return `item updated`;
    } catch (error) {
      console.log(error);
    }
  };

  deleteById = async () => {
    try {
      const items = this.collection.doc();
      await items.delete();
      console.log(items);
      return `items deleted`;
    } catch (error) {
      console.log(error);
    }
  };
}

export { ContenedorFirebase };
*/
