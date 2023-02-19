const addProduct = async (productId) => {
  console.log(productId);
  //aqui haces el fetch de la peticion para guardar el producto en el carrito.
  await fetch("/carritos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(productId),
  });
};
