import React, { useEffect, useState } from "react";
import "./App.css";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement
} from "chart.js";

// Register chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, LineElement, PointElement);

const API_BASE = 'http://localhost:5000/api';

function App() {
  const [products, setProducts] = useState([]);
  const [stockSummary, setStockSummary] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [activity, setActivity] = useState({ labels: [], data: [] });

  useEffect(() => {
    fetch(`${API_BASE}/products`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching products:", err));

    fetch(`${API_BASE}/stock-summary`)
      .then((res) => res.json())
      .then((data) => setStockSummary(data));

    fetch(`${API_BASE}/low-stock`)
      .then((res) => res.json())
      .then((data) => setLowStock(data));

    fetch(`${API_BASE}/weekly-activity`)
      .then((res) => res.json())
      .then((data) => setActivity(data));
  }, []);

  const barData = {
    labels: stockSummary.map((item) => item.category),
    datasets: [{
      label: "Stock by Category",
      data: stockSummary.map((item) => item.total_stock),
      backgroundColor: "#36A2EB"
    }]
  };

  const pieData = {
    labels: lowStock.map((item) => item.name),
    datasets: [{
      label: "Low Stock",
      data: lowStock.map((item) => item.stock),
      backgroundColor: ['#FF6384', '#FFCE56', '#4BC0C0']
    }]
  };

  const lineData = {
    labels: activity.labels,
    datasets: [{
      label: "Weekly Movement",
      data: activity.data,
      borderColor: "#9966FF",
      fill: false
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false
  };

  return (
    <div className="App" style={{ padding: '2rem' }}>
      <h1>📦 Stock Dashboard</h1>

      <table border="1" cellPadding="10" style={{ marginBottom: '2rem', width: '100%' }}>
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Category</th>
            <th>Current Stock</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id || product.id}>
              <td>{product.name}</td>
              <td>{product.category}</td>
              <td>{product.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'space-around' }}>
        <div style={{ width: '300px', height: '250px' }}>
          <h3>📊 Stock by Category</h3>
          <Bar data={barData} options={chartOptions} />
        </div>

        <div style={{ width: '300px', height: '250px' }}>
          <h3>🔻 Low Stock Products</h3>
          <Pie data={pieData} options={chartOptions} />
        </div>

        <div style={{ width: '100%', height: '300px', marginTop: '2rem' }}>
          <h3>📅 Weekly Inventory Movement</h3>
          <Line data={lineData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}

export default App;
