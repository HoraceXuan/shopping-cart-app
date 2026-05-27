import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import FloatingRobot from "../components/FloatingRobot";
import "./Orders.css";

export default function Orders() {
  const [purchaseHistory, setPurchaseHistory] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/purchase-history")
      .then((response) => response.json())
      .then((data) => {
        setPurchaseHistory(data);
      })
      .catch((error) => {
        console.error("Failed to fetch purchase history:", error);
      });
  }, []);

  const totalSpent = purchaseHistory.reduce(
    (sum, item) => sum + Number(item.total_price),
    0
  );

  const averageOrder =
    purchaseHistory.length > 0
      ? Math.round(totalSpent / purchaseHistory.length)
      : 0;

  const highestOrder =
    purchaseHistory.length > 0
      ? Math.max(...purchaseHistory.map((item) => Number(item.total_price)))
      : 0;

  const latestStatus = purchaseHistory.length > 0 ? "Completed" : "No Orders";

  return (
    <Layout>
      <div className="orders-page">
        <div className="orders-header">
          <h1>Orders</h1>
          <p>Track your recent purchases, order status, and monthly spending.</p>
        </div>

        <div className="orders-content">
          <main className="orders-main-area">
            <div className="orders-list">
              {purchaseHistory.length === 0 ? (
                <div className="empty-cart">
                  <h2>No orders yet</h2>
                  <p>Complete checkout to create your first purchase record.</p>
                </div>
              ) : (
                purchaseHistory.map((item) => (
                  <div className="order-card" key={item.id}>
                    <div className="order-main">
                      <div>
                        <h3>ORD-{item.id}</h3>
                        <p>
                          {item.purchased_at
                            ? new Date(item.purchased_at).toLocaleDateString()
                            : "Recent purchase"}
                        </p>
                      </div>

                      <span className="order-status delivered">Completed</span>
                    </div>

                    <div className="order-items">
                      <span>{item.product_name}</span>
                    </div>

                    <div className="order-footer">
                      <span>
                        {item.quantity} × ${Number(item.unit_price)}
                      </span>
                      <strong>${Number(item.total_price)}</strong>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="orders-robot-section">
              <div className="orders-robot-box">
                <FloatingRobot />
              </div>

              <div className="orders-robot-text">
                <span>AI Assistant</span>
                <h3>Monitoring your shopping activity</h3>
                <p>
                  Your assistant helps track real purchase records from the
                  MySQL database and calculate monthly spending automatically.
                </p>
              </div>
            </div>
          </main>

          <aside className="orders-right">
            <div className="orders-side-panel">
              <h2>Order Insights</h2>

              <div className="orders-stat">
                <span>Total Records</span>
                <strong>{purchaseHistory.length}</strong>
              </div>

              <div className="orders-stat">
                <span>Total Spent</span>
                <strong>${totalSpent}</strong>
              </div>

              <div className="orders-stat">
                <span>Latest Status</span>
                <strong>{latestStatus}</strong>
              </div>

              <div className="orders-helper">
                Your AI assistant is now reading real order data from the MySQL
                purchase history table.
              </div>
            </div>

            <div className="monthly-bill-panel">
              <div className="monthly-bill-header">
                <div>
                  <h2>Monthly Bill</h2>
                  <p>Database Spending Summary</p>
                </div>
                <span>Live</span>
              </div>

              <div className="monthly-total">
                <span>Total Database Spending</span>
                <strong>${totalSpent}</strong>
              </div>

              <div className="monthly-grid">
                <div>
                  <span>Records</span>
                  <strong>{purchaseHistory.length}</strong>
                </div>

                <div>
                  <span>Average</span>
                  <strong>${averageOrder}</strong>
                </div>

                <div>
                  <span>Highest</span>
                  <strong>${highestOrder}</strong>
                </div>
              </div>

              <div className="bill-list">
                {purchaseHistory.map((item) => (
                  <div className="bill-row" key={item.id}>
                    <div>
                      <strong>{item.product_name}</strong>
                      <span>
                        Qty {item.quantity} · $
                        {Number(item.unit_price)}
                      </span>
                    </div>
                    <p>${Number(item.total_price)}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </Layout>
  );
}