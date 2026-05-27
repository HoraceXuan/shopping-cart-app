import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import FloatingRobot from "../components/FloatingRobot";
import {
  clearCartItems,
  getCartItems,
  saveCartItems,
} from "../utils/cartStorage";
import "./Cart.css";

export default function Cart() {
  const [robotMessage, setRobotMessage] = useState("");
  const [robotActive, setRobotActive] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    setCartItems(getCartItems());
  }, []);

  const showRobotMessage = (message) => {
    setRobotMessage(message);
    setRobotActive(true);

    setTimeout(() => {
      setRobotMessage("");
      setRobotActive(false);
    }, 3000);
  };

  const updateCart = (updatedItems) => {
    setCartItems(updatedItems);
    saveCartItems(updatedItems);
  };

  const increaseQuantity = (id) => {
    const updatedItems = cartItems.map((item) =>
      item.id === id
        ? {
            ...item,
            quantity: item.quantity + 1,
          }
        : item
    );

    updateCart(updatedItems);
    showRobotMessage("Quantity increased. I updated your cart.");
  };

  const decreaseQuantity = (id) => {
    const updatedItems = cartItems
      .map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity - 1,
            }
          : item
      )
      .filter((item) => item.quantity > 0);

    updateCart(updatedItems);
    showRobotMessage("Quantity decreased. Your cart has been updated.");
  };

  const removeItem = (id, name) => {
    const updatedItems = cartItems.filter((item) => item.id !== id);

    updateCart(updatedItems);
    showRobotMessage(`${name} removed from your cart.`);
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      showRobotMessage("Your cart is empty. Please add products first.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/purchase-history", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cartItems,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save purchase history");
      }

      clearCartItems();
      setCartItems([]);

      showRobotMessage(
        "Checkout completed. Your purchase has been saved to database."
      );
    } catch (error) {
      console.error("Checkout error:", error);
      showRobotMessage("Checkout failed. Please check the backend server.");
    }
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  return (
    <Layout>
      <FloatingRobot message={robotMessage} active={robotActive} />

      <div className="cart-page">
        <div className="cart-header">
          <h1>Shopping Cart</h1>
          <p>Review your selected products before checkout.</p>
        </div>

        <div className="cart-layout">
          <div className="cart-items">
            {cartItems.length === 0 ? (
              <div className="empty-cart">
                <h2>Your cart is empty</h2>
                <p>Add some products to continue shopping.</p>
              </div>
            ) : (
              cartItems.map((item) => (
                <div className="cart-item" key={item.id}>
                  <div className="cart-item-image">{item.image}</div>

                  <div className="cart-item-info">
                    <h3>{item.name}</h3>
                    <p>${Number(item.price)} each</p>
                  </div>

                  <div className="cart-quantity">
                    <button onClick={() => decreaseQuantity(item.id)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => increaseQuantity(item.id)}>+</button>
                  </div>

                  <div className="cart-item-total">
                    ${Number(item.price) * item.quantity}
                  </div>

                  <button
                    className="remove-btn"
                    onClick={() => removeItem(item.id, item.name)}
                  >
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="cart-summary">
            <h2>Order Summary</h2>

            <div className="summary-row">
              <span>Subtotal</span>
              <strong>${subtotal}</strong>
            </div>

            <div className="summary-row">
              <span>Shipping</span>
              <strong>Free</strong>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-total">
              <span>Total</span>
              <strong>${subtotal}</strong>
            </div>

            <button className="checkout-btn" onClick={handleCheckout}>
              Checkout
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}