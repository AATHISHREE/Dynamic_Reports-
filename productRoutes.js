const express = require('express');
const router = express.Router();
const pool = require('../db');

// PUT /products/:id/stock
router.put('/products/:id/stock', async (req, res) => {
  const productId = req.params.id;
  const { newStock, userId } = req.body;

  try {
    // 1. Get product (with price)
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [productId]);
    const product = result.rows[0];

    if (!product) return res.status(404).send("Product not found");

    const price = product.price; // ✅ Get price from DB

    // 2. Update stock
    await pool.query('UPDATE products SET stock = $1 WHERE id = $2', [newStock, productId]);

    // 3. Add movement log
    await pool.query(
      'INSERT INTO inventory_logs (product_id, user_id, action) VALUES ($1, $2, $3)',
      [productId, userId, `Stock updated to ${newStock}`]
    );

    // 4. Check threshold
    if (newStock < product.threshold) {
      console.log(`⚠️ LOW STOCK ALERT: ${product.name} stock is below threshold!`);
    }

    res.status(200).send("Stock updated successfully");

  } catch (err) {
  console.error('🔥 Detailed Error:', err);
  res.status(500).send("Something went wrong");
}
});
// 📊 Stock summary by category
router.get('/stock-summary', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT category, SUM(stock) AS total_stock FROM products GROUP BY category`
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error in stock-summary:", err);
    res.status(500).send("Error fetching stock summary");
  }
});

// 🔻 Low-stock products
router.get('/low-stock', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT name, stock FROM products WHERE stock < threshold`
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error in low-stock:", err);
    res.status(500).send("Error fetching low stock");
  }
});

// 📅 Weekly activity (static)
router.get('/weekly-activity', (req, res) => {
  res.json({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    data: [20, 35, 25, 15, 30]
  });
});
module.exports = router;
