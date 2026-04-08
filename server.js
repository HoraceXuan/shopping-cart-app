const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend running!");
});

// 获取所有商品
app.get("/products", (req, res) => {
  db.query("SELECT * FROM products", (err, results) => {
    if (err) {
      console.error("SQL Error in /products:", err);
      return res.status(500).send("Database error");
    }
    res.json(results);
  });
});

// 获取购物车
app.get("/cart", (req, res) => {
  const sql = `
    SELECT 
      cart_items.id,
      cart_items.product_id,
      cart_items.quantity,
      products.name,
      products.price
    FROM cart_items
    JOIN products ON cart_items.product_id = products.id
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("SQL Error in /cart:", err);
      return res.status(500).json({ error: "Failed to fetch cart" });
    }
    res.json(results);
  });
});

// 加入购物车
app.post("/cart", (req, res) => {
  const { product_id, quantity } = req.body;

  const checkSql = "SELECT * FROM cart_items WHERE product_id = ?";
  db.query(checkSql, [product_id], (err, results) => {
    if (err) {
      console.error("SQL Error in POST /cart check:", err);
      return res.status(500).json({ error: "Failed to check cart item" });
    }

    if (results.length > 0) {
      const updateSql =
        "UPDATE cart_items SET quantity = quantity + ? WHERE product_id = ?";
      db.query(updateSql, [quantity, product_id], (err) => {
        if (err) {
          console.error("SQL Error in POST /cart update:", err);
          return res.status(500).json({ error: "Failed to update cart item" });
        }
        res.json({ message: "Cart item quantity updated" });
      });
    } else {
      const insertSql =
        "INSERT INTO cart_items (product_id, quantity) VALUES (?, ?)";
      db.query(insertSql, [product_id, quantity], (err, result) => {
        if (err) {
          console.error("SQL Error in POST /cart insert:", err);
          return res.status(500).json({ error: "Failed to add to cart" });
        }
        res.json({ message: "Item added to cart", id: result.insertId });
      });
    }
  });
});

// 修改购物车数量
app.put("/cart/:id", (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  const sql = "UPDATE cart_items SET quantity = ? WHERE id = ?";
  db.query(sql, [quantity, id], (err) => {
    if (err) {
      console.error("SQL Error in PUT /cart/:id:", err);
      return res.status(500).json({ error: "Failed to update cart item" });
    }
    res.json({ message: "Cart item updated" });
  });
});

// 删除购物车商品
app.delete("/cart/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM cart_items WHERE id = ?";
  db.query(sql, [id], (err) => {
    if (err) {
      console.error("SQL Error in DELETE /cart/:id:", err);
      return res.status(500).json({ error: "Failed to delete cart item" });
    }
    res.json({ message: "Cart item deleted" });
  });
});

// 结账：把购物车写入消费记录，并清空购物车
app.post("/checkout", (req, res) => {
  const cartSql = `
    SELECT 
      cart_items.product_id,
      cart_items.quantity,
      products.name,
      products.price
    FROM cart_items
    JOIN products ON cart_items.product_id = products.id
  `;

  db.query(cartSql, (err, cartItems) => {
    if (err) {
      console.error("SQL Error in /checkout cart query:", err);
      return res.status(500).json({ error: "Failed to read cart items" });
    }

    if (cartItems.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    const values = cartItems.map((item) => [
      item.product_id,
      item.name,
      item.price,
      item.quantity,
      Number(item.price) * Number(item.quantity),
    ]);

    const insertHistorySql = `
      INSERT INTO purchase_history
      (product_id, product_name, unit_price, quantity, total_price)
      VALUES ?
    `;

    db.query(insertHistorySql, [values], (err) => {
      if (err) {
        console.error("SQL Error in /checkout insert history:", err);
        return res.status(500).json({ error: "Failed to save purchase history" });
      }

      db.query("DELETE FROM cart_items", (err) => {
        if (err) {
          console.error("SQL Error in /checkout clear cart:", err);
          return res.status(500).json({ error: "Failed to clear cart" });
        }

        res.json({ message: "Checkout successful" });
      });
    });
  });
});

// 获取本月账单
app.get("/monthly-summary", (req, res) => {
  const itemsSql = `
    SELECT *
    FROM purchase_history
    WHERE YEAR(purchased_at) = YEAR(CURDATE())
      AND MONTH(purchased_at) = MONTH(CURDATE())
    ORDER BY purchased_at DESC, id DESC
  `;

  const totalSql = `
    SELECT COALESCE(SUM(total_price), 0) AS monthly_total
    FROM purchase_history
    WHERE YEAR(purchased_at) = YEAR(CURDATE())
      AND MONTH(purchased_at) = MONTH(CURDATE())
  `;

  db.query(itemsSql, (err, items) => {
    if (err) {
      console.error("SQL Error in /monthly-summary items:", err);
      return res.status(500).json({ error: "Failed to fetch monthly items" });
    }

    db.query(totalSql, (err, totalResult) => {
      if (err) {
        console.error("SQL Error in /monthly-summary total:", err);
        return res.status(500).json({ error: "Failed to fetch monthly total" });
      }

      res.json({
        items,
        monthly_total: totalResult[0].monthly_total,
      });
    });
  });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});