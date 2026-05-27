const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("AI Shop backend is running");
});

app.get("/api/products", (req, res) => {
  const sql = "SELECT * FROM products";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Failed to fetch products:", err);
      return res.status(500).json({ message: "Failed to fetch products" });
    }

    res.json(results);
  });
});

app.post("/api/register", (req, res) => {
  const { email, password } = req.body;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{1,10}$/;

  if (!emailRegex.test(email)) {
    return res.status(400).json({
      message: "Account must be a valid email address.",
    });
  }

  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message:
        "Password must contain both letters and numbers, and be no more than 10 characters.",
    });
  }

  const checkSql = "SELECT * FROM users WHERE email = ?";

  db.query(checkSql, [email], (checkErr, existingUsers) => {
    if (checkErr) {
      console.error("Register check error:", checkErr);
      return res.status(500).json({ message: "Database error" });
    }

    if (existingUsers.length > 0) {
      return res.status(409).json({
        message: "This email has already been registered.",
      });
    }

    const insertSql = "INSERT INTO users (email, password) VALUES (?, ?)";

    db.query(insertSql, [email, password], (insertErr) => {
      if (insertErr) {
        console.error("Register insert error:", insertErr);
        return res.status(500).json({ message: "Failed to register user" });
      }

      res.json({
        message: "Registration successful.",
      });
    });
  });
});

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT id, email FROM users WHERE email = ? AND password = ?";

  db.query(sql, [email, password], (err, results) => {
    if (err) {
      console.error("Login error:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (results.length === 0) {
      return res.status(401).json({
        message: "Incorrect email or password.",
      });
    }

    res.json({
      message: "Login successful.",
      user: results[0],
    });
  });
});

app.post("/api/purchase-history", (req, res) => {
  const { items } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: "No items provided" });
  }

  const values = items.map((item) => [
    item.id,
    item.name,
    item.price,
    item.quantity,
    item.price * item.quantity,
  ]);

  const sql = `
    INSERT INTO purchase_history
    (product_id, product_name, unit_price, quantity, total_price)
    VALUES ?
  `;

  db.query(sql, [values], (err, result) => {
    if (err) {
      console.error("Failed to save purchase history:", err);
      return res.status(500).json({
        message: "Failed to save purchase history",
      });
    }

    res.json({
      message: "Purchase history saved successfully",
      affectedRows: result.affectedRows,
    });
  });
});

app.get("/api/purchase-history", (req, res) => {
  const sql = "SELECT * FROM purchase_history ORDER BY purchased_at DESC";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Failed to fetch purchase history:", err);
      return res.status(500).json({
        message: "Failed to fetch purchase history",
      });
    }

    res.json(results);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});