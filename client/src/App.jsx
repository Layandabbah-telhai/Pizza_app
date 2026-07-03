import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:3001";

function App() {
  const [menu, setMenu] = useState(null);
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

  if (!menu) {
    return <div className="page">Loading menu...</div>;
  }

  return (
    <div className="page">
      <h1>Pizza Ordering System</h1>

      {error && <div className="error">{error}</div>}

      <section>
        <h2>Menu From Server</h2>

        <div data-testid="menu-list" className="box">
          <h3>Pizzas</h3>
          <ul>
            {menu.pizzas.map((pizza) => (
              <li key={pizza.id}>
                {pizza.name} - ₪{pizza.price}
              </li>
            ))}
          </ul>

          <h3>Sizes</h3>
          <ul>
            {menu.sizes.map((size) => (
              <li key={size.id}>
                {size.name} - ₪{size.price}
              </li>
            ))}
          </ul>

          <h3>Toppings</h3>
          <ul>
            {menu.toppings.map((topping) => (
              <li key={topping.id}>
                {topping.name} - ₪{topping.price}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

export default App;