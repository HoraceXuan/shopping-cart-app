import { useEffect, useState } from "react";

function App() {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [monthlyItems, setMonthlyItems] = useState([]);
  const [monthlyTotal, setMonthlyTotal] = useState(0);

  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingCart, setLoadingCart] = useState(true);
  const [loadingMonthly, setLoadingMonthly] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = () => {
    setLoadingProducts(true);

    fetch("http://localhost:3000/products")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        return response.json();
      })
      .then((data) => {
        setProducts(data);
        setLoadingProducts(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load products");
        setLoadingProducts(false);
      });
  };

  const fetchCart = () => {
    setLoadingCart(true);

    fetch("http://localhost:3000/cart")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch cart");
        }
        return response.json();
      })
      .then((data) => {
        setCartItems(data);
        setLoadingCart(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load cart");
        setLoadingCart(false);
      });
  };

  const fetchMonthlySummary = () => {
    setLoadingMonthly(true);

    fetch("http://localhost:3000/monthly-summary")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch monthly summary");
        }
        return response.json();
      })
      .then((data) => {
        setMonthlyItems(data.items || []);
        setMonthlyTotal(Number(data.monthly_total || 0));
        setLoadingMonthly(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load monthly summary");
        setLoadingMonthly(false);
      });
  };

  useEffect(() => {
    fetchProducts();
    fetchCart();
    fetchMonthlySummary();
  }, []);

  const addToCart = (productId) => {
    fetch("http://localhost:3000/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_id: productId,
        quantity: 1,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to add to cart");
        }
        return response.json();
      })
      .then(() => {
        fetchCart();
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to add to cart");
      });
  };

  const updateCartQuantity = (id, quantity) => {
    if (quantity <= 0) {
      deleteCartItem(id);
      return;
    }

    fetch(`http://localhost:3000/cart/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ quantity }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update cart");
        }
        return response.json();
      })
      .then(() => {
        fetchCart();
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to update cart");
      });
  };

  const deleteCartItem = (id) => {
    fetch(`http://localhost:3000/cart/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete cart item");
        }
        return response.json();
      })
      .then(() => {
        fetchCart();
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to delete item");
      });
  };

  const checkout = () => {
    fetch("http://localhost:3000/checkout", {
      method: "POST",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to checkout");
        }
        return response.json();
      })
      .then(() => {
        alert("Checkout successful!");
        fetchCart();
        fetchMonthlySummary();
      })
      .catch((err) => {
        console.error(err);
        alert("Checkout failed");
      });
  };

  const cartTotal = cartItems.reduce((total, item) => {
    return total + Number(item.price) * Number(item.quantity);
  }, 0);

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>Shopping Cart Application</h1>

      <h2>Product List</h2>
      {loadingProducts && <p>Loading products...</p>}
      {error && <p>{error}</p>}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
          marginTop: "20px",
          marginBottom: "40px",
        }}
      >
        {products.map((product) => (
          <div
            key={product.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "20px",
              backgroundColor: "#f9f9f9",
            }}
          >
            <h3>{product.name}</h3>
            <p>Price: ${product.price}</p>

            <button
              onClick={() => addToCart(product.id)}
              style={{
                padding: "10px 16px",
                border: "none",
                borderRadius: "6px",
                backgroundColor: "#0077cc",
                color: "white",
                cursor: "pointer",
              }}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      <h2>Shopping Cart</h2>
      {loadingCart && <p>Loading cart...</p>}

      {!loadingCart && cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div style={{ marginTop: "20px", marginBottom: "40px" }}>
          {cartItems.map((item) => (
            <div
              key={item.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "16px",
                marginBottom: "16px",
                backgroundColor: "#f4f4f4",
              }}
            >
              <h3>{item.name}</h3>
              <p>Price: ${item.price}</p>
              <p>Quantity: {item.quantity}</p>

              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <button
                  onClick={() =>
                    updateCartQuantity(item.id, Number(item.quantity) + 1)
                  }
                  style={{
                    padding: "8px 12px",
                    border: "none",
                    borderRadius: "6px",
                    backgroundColor: "#28a745",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  +
                </button>

                <button
                  onClick={() =>
                    updateCartQuantity(item.id, Number(item.quantity) - 1)
                  }
                  style={{
                    padding: "8px 12px",
                    border: "none",
                    borderRadius: "6px",
                    backgroundColor: "#ffc107",
                    color: "black",
                    cursor: "pointer",
                  }}
                >
                  -
                </button>

                <button
                  onClick={() => deleteCartItem(item.id)}
                  style={{
                    padding: "8px 12px",
                    border: "none",
                    borderRadius: "6px",
                    backgroundColor: "#dc3545",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <h3>Total: ${cartTotal.toFixed(2)}</h3>

          <button
            onClick={checkout}
            style={{
              marginTop: "16px",
              padding: "12px 20px",
              border: "none",
              borderRadius: "6px",
              backgroundColor: "#6f42c1",
              color: "white",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Checkout
          </button>
        </div>
      )}

      <h2>Monthly Bill</h2>
      {loadingMonthly && <p>Loading monthly bill...</p>}

      {!loadingMonthly && monthlyItems.length === 0 ? (
        <p>No spending records this month.</p>
      ) : (
        <div style={{ marginTop: "20px" }}>
          {monthlyItems.map((item) => (
            <div
              key={item.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "16px",
                marginBottom: "16px",
                backgroundColor: "#fff8e1",
              }}
            >
              <h3>{item.product_name}</h3>
              <p>Unit Price: ${item.unit_price}</p>
              <p>Quantity: {item.quantity}</p>
              <p>Total: ${item.total_price}</p>
              <p>Purchased At: {item.purchased_at}</p>
            </div>
          ))}

          <h3>This Month Total: ${monthlyTotal.toFixed(2)}</h3>
        </div>
      )}
    </div>
  );
}

export default App;