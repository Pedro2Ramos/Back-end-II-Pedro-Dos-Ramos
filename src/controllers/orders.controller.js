// src/controllers/orders.controller.js

import Orders from "../daos/orders.dao.js";
import Buyer from "../daos/buyer.dao.js";
import Business from "../daos/business.dao.js";

const buyerService = new Buyer();
const ordersService = new Orders();
const businessService = new Business();

export const getOrders = async (req, res) => {
  try {
    const result = await ordersService.get();
    res.send({ status: "success", result });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
};

export const getOrderById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await ordersService.getById(id);
    if (!result) {
      return res.status(404).send({ message: "Order not found" });
    }
    res.send({ status: "success", result });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
};

export const createOrder = async (req, res) => {
  const { idBuyer, idBusiness, products, quantities } = req.body;

  try {
    if (!idBuyer || !idBusiness || !products || !quantities) {
      return res.status(400).send({ message: "Required parameters are missing" });
    }
    if (products.length !== quantities.length) {
      return res
        .status(400)
        .send({ message: "Products and quantities arrays must have the same length" });
    }

    const resultBuyer = await buyerService.getById(idBuyer);
    if (!resultBuyer) {
      return res.status(404).send({ message: "Buyer not found" });
    }

    const resultBusiness = await businessService.getById(idBusiness);
    if (!resultBusiness) {
      return res.status(404).send({ message: "Business not found" });
    }

    const actualProducts = resultBusiness.products.filter((product) =>
      products.includes(product.name)
    );

    if (products.length !== actualProducts.length) {
      return res.status(400).send({ message: "Not all products are available" });
    }

  
    for (let i = 0; i < actualProducts.length; i++) {
      const product = actualProducts[i];
      const quantity = quantities[i];

      if (product.stock < quantity) {
        return res
          .status(400)
          .send({ message: `Insufficient stock for product ${product.name}` });
      }
    }

 
    const total = actualProducts.reduce(
      (acc, product, index) => acc + product.price * quantities[index],
      0
    );

    const order = {
      business: resultBusiness,
      buyer: resultBuyer,
      status: "pending",
      products: actualProducts.map((product, index) => ({
        ...product,
        quantity: quantities[index],
      })),
      totalPrice: total,
    };

    const orderResult = await ordersService.create(order);
    if (!orderResult) {
      return res.status(400).send({ message: "Failed to create order" });
    }


    resultBuyer.orders.push(orderResult._id);
    await buyerService.update(idBuyer, resultBuyer);

    res.status(201).send({ status: "success", orderResult });
  } catch (error) {
    console.error("Error creating order:", error);
    res
      .status(500)
      .send({ status: "error", message: "An error occurred while creating the order", error: error.message });
  }
};

export const resolveOrder = async (req, res) => {
  const { id } = req.params;
  const { resolve } = req.body;

  if (!id || !resolve)
    return res.status(400).send({ message: "Required parameters are missing" });
  if (!["confirmed", "pending", "cancelled"].includes(resolve)) {
    return res.status(400).send({ message: "Invalid 'resolve' parameter" });
  }

  try {
    const order = await ordersService.getById(id);
    if (!order) {
      return res.status(404).send({ message: "Order not found" });
    }

    order.status = resolve;
    await ordersService.resolve(order._id, order);

    res.send({ status: "success", result: "Order resolved" });
  } catch (error) {
    console.error("Error resolving order:", error);
    res.status(500).send({
      status: "error",
      message: "An error occurred while resolving the order",
      error: error.message,
    });
  }
};
