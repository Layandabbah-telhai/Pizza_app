const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

let orders = [];
let nextOrderId = 1;

const menu = {
  pizzas: [
    { id: "margherita", name: "Margherita", price: 35 },
    { id: "vegetarian", name: "Vegetarian", price: 39 },
    { id: "pepperoni", name: "Pepperoni", price: 42 },
  ],
  sizes: [
    { id: "small", name: "Small", price: 0 },
    { id: "medium", name: "Medium", price: 8 },
    { id: "large", name: "Large", price: 15 },
  ],
  toppings: [
    { id: "olives", name: "Olives", price: 4 },
    { id: "mushrooms", name: "Mushrooms", price: 4 },
    { id: "corn", name: "Corn", price: 4 },
    { id: "onion", name: "Onion", price: 4.5 },
    { id: "extra_cheese", name: "Extra Cheese", price: 3.5 },
  ],
};

const validStatuses = ["new", "preparing", "ready", "delivered"];

function findPizza(pizzaId) {
  return menu.pizzas.find((pizza) => pizza.id === pizzaId);
}

function findSize(sizeId) {
  return menu.sizes.find((size) => size.id === sizeId);
}

function findTopping(toppingId) {
  return menu.toppings.find((topping) => topping.id === toppingId);
}

function validateOrderInput(body) {
  if (!body.customerName || !body.phone || !body.deliveryAddress) {
    return "Customer name, phone, and delivery address are required";
  }

  if (!Array.isArray(body.pizzas) || body.pizzas.length === 0) {
    return "Order must contain at least one pizza";
  }

  for (const pizzaItem of body.pizzas) {
    if (!pizzaItem.pizzaId || !findPizza(pizzaItem.pizzaId)) {
      return "Invalid pizza id";
    }

    if (!pizzaItem.size || !findSize(pizzaItem.size)) {
      return "Invalid pizza size";
    }

    if (!Array.isArray(pizzaItem.toppings)) {
      return "Toppings must be an array";
    }

    if (pizzaItem.toppings.length > 3) {
      return "A pizza cannot have more than three toppings";
    }

    for (const toppingId of pizzaItem.toppings) {
      if (!findTopping(toppingId)) {
        return "Invalid topping id";
      }
    }
  }

  return null;
}

function calculateOrderPrice(pizzas) {
  let total = 0;

  for (const pizzaItem of pizzas) {
    const pizza = findPizza(pizzaItem.pizzaId);
    const size = findSize(pizzaItem.size);

    total += pizza.price;
    total += size.price;

    for (const toppingId of pizzaItem.toppings) {
      const topping = findTopping(toppingId);
      total += topping.price;
    }
  }

  const deliveryFee = total > 100 ? 0 : 15;

  return {
    itemsPrice: total,
    deliveryFee,
    totalPrice: total + deliveryFee,
  };
}

function buildOrderPizzas(pizzas) {
  return pizzas.map((pizzaItem) => {
    const pizza = findPizza(pizzaItem.pizzaId);
    const size = findSize(pizzaItem.size);
    const toppings = pizzaItem.toppings.map((toppingId) => findTopping(toppingId));

    return {
      pizzaId: pizza.id,
      pizzaName: pizza.name,
      size: size.id,
      sizeName: size.name,
      toppings: toppings.map((topping) => ({
        id: topping.id,
        name: topping.name,
        price: topping.price,
      })),
    };
  });
}

app.get("/api/menu", (req, res) => {
  return res.status(200).json(menu);
});

app.post("/api/orders", (req, res) => {
  const validationError = validateOrderInput(req.body);

  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const price = calculateOrderPrice(req.body.pizzas);

  const order = {
    orderId: nextOrderId++,
    customerName: req.body.customerName,
    phone: req.body.phone,
    deliveryAddress: req.body.deliveryAddress,
    pizzas: buildOrderPizzas(req.body.pizzas),
    itemsPrice: price.itemsPrice,
    deliveryFee: price.deliveryFee,
    totalPrice: price.totalPrice,
    status: "new",
    paymentStatus: "paid",
    createdAt: new Date().toISOString(),
  };

  orders.push(order);
  return res.status(201).json(order);
});

app.get("/api/orders", (req, res) => {
  const { status } = req.query;

  if (!status) {
    return res.status(200).json(orders);
  }

  const filteredOrders = orders.filter((order) => order.status === status);
  return res.status(200).json(filteredOrders);
});

app.get("/api/orders/:id", (req, res) => {
  const orderId = Number(req.params.id);
  const order = orders.find((item) => item.orderId === orderId);

  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }

  return res.status(200).json(order);
});

app.listen(PORT, () => {
  console.log(`Pizza server is running on port ${PORT}`);
});