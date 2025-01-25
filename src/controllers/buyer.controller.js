import Buyer from "../daos/buyer.dao.js";

const buyerService = new Buyer();


export const getBuyers = async (req, res) => {
  try {
    const buyers = await buyerService.get();
    res.status(200).json({ status: "success", data: buyers });
  } catch (error) {
    console.error("Error al obtener los compradores:", error);
    res.status(500).json({
      status: "error",
      message: "No se pudieron obtener los compradores.",
      error: error.message,
    });
  }
};


export const getBuyerById = async (req, res) => {
  const { id } = req.params;
  try {
    const buyer = await buyerService.getById(id);
    if (!buyer) {
      return res
        .status(404)
        .json({ status: "error", message: `Comprador con ID ${id} no encontrado.` });
    }
    res.status(200).json({ status: "success", data: buyer });
  } catch (error) {
    console.error(`Error al obtener el comprador con ID ${id}:`, error);
    res.status(500).json({
      status: "error",
      message: "Error interno del servidor.",
      error: error.message,
    });
  }
};


export const saveBuyer = async (req, res) => {
  const buyer = req.body;
  if (!buyer.name || !buyer.email || !buyer.age) {
    return res.status(400).json({
      status: "error",
      message: "El nombre, el correo electrónico y la edad son obligatorios.",
    });
  }

  try {
    const newBuyer = await buyerService.save(buyer);
    res.status(201).json({ status: "success", data: newBuyer });
  } catch (error) {
    console.error("Error al guardar el comprador:", error);
    res.status(500).json({
      status: "error",
      message: "Error interno al guardar el comprador.",
      error: error.message,
    });
  }
};
