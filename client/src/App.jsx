import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:3001";

function App() {
  const [menu, setMenu] = useState(null);
  const [selectedPizza, setSelectedPizza] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [cart, setCart] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMenu();
  }, []);

  async function fetchMenu() {
    try {
      const response = await fetch(`${API_URL}/api/menu`);
      const data = await response.json();
      setMenu(data);
    } catch (err) {
      setError("Cannot connect to server.");
    }
  }

  function handleToppingChange(toppingId) {
    if (selectedToppings.includes(toppingId)) {
      setSelectedToppings(selectedToppings.filter((id) => id !== toppingId));
      return;
    }

    setSelectedToppings([...selectedToppings, toppingId]);
  }

  function addPizzaToCart() {
    setError("");

    if (!selectedPizza || !selectedSize) {
      setError("Please choose pizza and size.");
      return;
    }

    if (selectedToppings.length > 3) {
      setError("You can choose up to three toppings for each pizza.");
      return;
    }

    const pizza = menu.pizzas.find((item) => item.id === selectedPizza);
    const size = menu.sizes.find((item) => item.id === selectedSize);
    const toppings = selectedToppings.map((id) =>
      menu.toppings.find((item) => item.id === id)
    );

    setCart([
      ...cart,
      {
        pizzaId: pizza.id,
        pizzaName: pizza.name,
        size: size.id,
        sizeName: size.name,
        toppings,
      },
    ]);

    setSelectedPizza("");
    setSelectedSize("");
    setSelectedToppings([]);
  }

  if (!menu) {
    return <div className="page">Loading menu...</div>;
  }

  return (
    <div className="page">
      <h1>Pizza Ordering System</h1>

      {error && <div className="error">{error}</div>}

      <section>
        <h2>Customer Screen</h2>

        <div data-testid="menu-list" className="box">
          <h3>Menu</h3>

          <h4>Pizzas</h4>
          <ul>
            {menu.pizzas.map((pizza) => (
              <li key={pizza.id}>
                {pizza.name} - ₪{pizza.price}
              </li>
            ))}
          </ul>

          <h4>Sizes</h4>
          <ul>
            {menu.sizes.map((size) => (
              <li key={size.id}>
                {size.name} - ₪{size.price}
              </li>
            ))}
          </ul>

          <h4>Toppings</h4>
          <ul>
            {menu.toppings.map((topping) => (
              <li key={topping.id}>
                {topping.name} - ₪{topping.price}
              </li>
            ))}
          </ul>
        </div>

        <div className="box">
  <h3>Build Pizza</h3>

  <div className="form-row">
    <div className="form-group">
      <label>Pizza:</label>
      <select
        value={selectedPizza}
        onChange={(e) => setSelectedPizza(e.target.value)}
      >
        <option value="">Choose pizza</option>
        {menu.pizzas.map((pizza) => (
          <option key={pizza.id} value={pizza.id}>
            {pizza.name}
          </option>
        ))}
      </select>
    </div>

    <div className="form-group">
      <label>Size:</label>
      <select
        value={selectedSize}
        onChange={(e) => setSelectedSize(e.target.value)}
      >
        <option value="">Choose size</option>
        {menu.sizes.map((size) => (
          <option key={size.id} value={size.id}>
            {size.name}
          </option>
        ))}
      </select>
    </div>
  </div>

  <h4>Toppings</h4>
  <div className="toppings-grid">
    {menu.toppings.map((topping) => (
      <label key={topping.id} className="checkbox">
        <input
          type="checkbox"
          checked={selectedToppings.includes(topping.id)}
          onChange={() => handleToppingChange(topping.id)}
        />
        {topping.name}
      </label>
    ))}
  </div>

  <button className="center-button" onClick={addPizzaToCart}>
    Add to Cart
  </button>
</div>

       <div data-testid="cart" className="box">
  <h3>Cart</h3>
  {cart.length === 0 ? (
    <p>No pizzas in cart.</p>
  ) : (
    <ul className="cart-list">
      {cart.map((item, index) => (
        <li key={index} className="cart-item">
          <strong>🍕 {item.pizzaName}</strong>
          <br />
          Size: {item.sizeName}
          {item.toppings.length > 0 && (
            <>
              <br />
              Toppings: {item.toppings.map((topping) => topping.name).join(", ")}
            </>
          )}
        </li>
      ))}
    </ul>
  )}
</div>
      </section>
    </div>
  );
}

export default App;