"use client";
import React, { useState, useEffect } from "react";

export default function DashboardPage() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState(0);

  useEffect(() => {
    setOrders([
      { id: 1, item: "Shrimp Basket", total: "$15.99" },
      { id: 2, item: "Combo", total: "$19.99" }
    ]);
    setCustomers(42);
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">📊 Dashboard</h1>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">Orders Today</p>
          <p className="text-xl font-semibold">{orders.length}</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">Customers</p>
          <p className="text-xl font-semibold">{customers}</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">Est Revenue</p>
          <p className="text-xl font-semibold">$350</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-3">Recent Orders</h2>
        {orders.map(o => (
          <div key={o.id} className="flex justify-between border-b py-2">
            <span>{o.item}</span>
            <span>{o.total}</span>
          </div>
        ))}
      </div>
    </div>
  );
}