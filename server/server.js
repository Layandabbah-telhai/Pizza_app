const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

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

app.get("/api/menu", (req, res) => {
  return res.status(200).json(menu);
});

app.listen(PORT, () => {
  console.log(`Pizza server is running on port ${PORT}`);
});