const express = require('express');
const cors = require('cors');
const app = express();
const productRoutes = require('./routes/productRoutes');

app.use(cors());
app.use(express.json());

app.use('/api', productRoutes); // ✅ API route base

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
