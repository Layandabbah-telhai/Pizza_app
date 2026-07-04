import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:3001";

function App() {
  const [menu, setMenu] = useState(null);
  const [selectedPizza, setSelectedPizza] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [cart, setCart] = useState([]);

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");

  const [confirmation, setConfirmation] = useState(null);
  const [trackId, setTrackId] = useState("");
  const [trackedOrder, setTrackedOrder] = useState(null);
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

  function calculateEstimatedPrice() {
    if (!menu) {
      return {
        itemsPrice: 0,
        deliveryFee: 0,
        totalPrice: 0,
      };
    }

    let itemsPrice = 0;

    for (const item of cart) {
      const pizza = menu.pizzas.find((pizzaItem) => pizzaItem.id === item.pizzaId);
      const size = menu.sizes.find((sizeItem) => sizeItem.id === item.size);

      itemsPrice += pizza.price;
      itemsPrice += size.price;

      for (const topping of item.toppings) {
        itemsPrice += topping.price;
      }
    }

    const deliveryFee = itemsPrice > 100 ? 0 : 15;

    return {
      itemsPrice,
      deliveryFee,
      totalPrice: itemsPrice + deliveryFee,
    };
  }

  async function submitOrder() {
    setError("");
    setConfirmation(null);

    if (!customerName || !phone || !deliveryAddress) {
      setError("Please enter customer name, phone, and delivery address.");
      return;
    }

    if (cart.length === 0) {
      setError("Please add at least one pizza to the cart.");
      return;
    }

    const orderBody = {
      customerName,
      phone,
      deliveryAddress,
      pizzas: cart.map((item) => ({
        pizzaId: item.pizzaId,
        size: item.size,
        toppings: item.toppings.map((topping) => topping.id),
      })),
    };

    const response = await fetch(`${API_URL}/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderBody),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error || "Failed to create order.");
      return;
    }

    setConfirmation(data);
    setCart([]);
    setCustomerName("");
    setPhone("");
    setDeliveryAddress("");
  }

  async function trackOrder() {
    setError("");
    setTrackedOrder(null);

    const response = await fetch(`${API_URL}/api/orders/${trackId}`);
    const data = await response.json();

    if (!response.ok) {
      setError(data.error || "Order not found.");
      return;
    }

    setTrackedOrder(data);
  }

  if (!menu) {
    return <div className="page">Loading menu...</div>;
  }

  const estimatedPrice = calculateEstimatedPrice();

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
                      Toppings:{" "}
                      {item.toppings.map((topping) => topping.name).join(", ")}
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div data-testid="order-summary-panel" className="box">
          <h3>Order Summary</h3>
          <p>Items price: ₪{estimatedPrice.itemsPrice}</p>
          <p>Delivery fee: ₪{estimatedPrice.deliveryFee}</p>
          <p>Estimated total price: ₪{estimatedPrice.totalPrice}</p>
          <p>The final price is calculated again by the server after order submission.</p>
        </div>

        <div className="box">
          <h3>Checkout</h3>

          <input
            placeholder="Customer name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />

          <input
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <input
            placeholder="Delivery address"
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
          />

          <button data-testid="checkout-button" onClick={submitOrder}>
            Pay and Create Order
          </button>
        </div>

        {confirmation && (
          <div data-testid="order-confirmation" className="success">
            <h3>Order Confirmation</h3>
            <p>Order number: {confirmation.orderId}</p>
            <p>Status: {confirmation.status}</p>
            <p>Items price from server: ₪{confirmation.itemsPrice}</p>
            <p>Delivery fee from server: ₪{confirmation.deliveryFee}</p>
            <p>Total price from server: ₪{confirmation.totalPrice}</p>
          </div>
        )}

        <div className="box">
          <h3>Track Order</h3>
          <input
            placeholder="Order ID"
            value={trackId}
            onChange={(e) => setTrackId(e.target.value)}
          />

          <button onClick={trackOrder}>Track</button>

          {trackedOrder && (
            <p>
              Order #{trackedOrder.orderId} status: {trackedOrder.status}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

export default App;