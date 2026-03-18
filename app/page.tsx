"use client";
import React, { useState, useEffect } from "react";

const BRAND = {
  name: "Plenty of Fish Seafood",
  orderLink: "https://orderplentyoffishseafood.com/order",
  phone: "tel:+16614719620",
  displayPhone: "661.471.9620",
  address: "43937 15th Street West, Lancaster, CA 93534",
  email: "info@orderplentyoffishseafood.com",
  status: "Open • Closes 9PM",
  gaId: "G-XXXXXXXXXX",
};

const menu = [
  { name: "Shrimp Basket", desc: "Crispy shrimp, fries, house sauce", price: "$15.99", img: "/images/shrimp.png" },
  { name: "Fish & Chips", desc: "Golden fried fish, seasoned fries", price: "$14.99", img: "/images/fish.png" },
  { name: "Seafood Combo", desc: "Best value combo (Save $5)", price: "$19.99", img: "/images/combo.png", badge: "Best Value" }
];

const addons = [
  { name: "Extra Shrimp", price: "+$4" },
  { name: "Large Fries", price: "+$3" },
  { name: "Drink", price: "+$2" }
];

export default function Page() {
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const s = document.createElement("script");
    s.src = `https://www.googletagmanager.com/gtag/js?id=${BRAND.gaId}`;
    s.async = true;
    document.head.appendChild(s);
  }, []);

  const handleSMS = async () => {
    if (!phone) return alert("Enter phone number");
    await fetch("/api/sms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone })
    });
    setSubmitted(true);
  };

  return (
    <div className="bg-white text-gray-900 leading-relaxed">

      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-4 py-3">
          <div className="flex items-center gap-3">
            <img src="/logo.png" className="h-12" />
            <span className="font-semibold text-blue-800">POF Seafood</span>
          </div>

          {/* NAV */}
          <nav className="hidden md:flex gap-6 text-sm font-medium">
            <a href="#menu" className="hover:text-red-600">Menu</a>
            <a href="#deals" className="hover:text-red-600">Deals</a>
            <a href="#contact" className="hover:text-red-600">Contact</a>
          </nav>

          <button onClick={() => (window.location.href = BRAND.orderLink)} className="bg-red-600 text-white px-5 py-2 rounded-xl">Order Now</button>
        </div>
      </header>

      {/* HERO (FIXED SIZE) */}
      <section className="bg-blue-900 text-white text-center py-14 px-4">
        <img src="/logo.png" className="h-28 mx-auto mb-4" />
        <h1 className="text-3xl md:text-4xl font-semibold mb-3">Fresh Seafood. Better Prices.</h1>
        <p className="text-base mb-5 opacity-90">Order direct & save money every time</p>
        <button onClick={() => (window.location.href = BRAND.orderLink)} className="bg-red-600 px-6 py-3 rounded-xl text-base">Order Now</button>
      </section>

      {/* 💵 CASH INCENTIVE (TOP) */}
      <section className="bg-green-50 border-y py-6 text-center">
        <h2 className="text-lg md:text-xl font-semibold mb-1">💵 Pay Cash & Save More</h2>
        <p className="text-gray-700 text-sm">Avoid card fees • Best pricing in-store</p>
      </section>

      {/* VALUE STACK */}
      <section className="py-10 text-center">
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6 text-sm">
          <div>💰 Save $3–$5 per order</div>
          <div>⚡ Faster than DoorDash</div>
          <div>🎁 Exclusive deals</div>
        </div>
      </section>

      {/* FULL MENU SECTION */}
      <section id="menu" className="py-14 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto text-center mb-8">
          <h2 className="text-3xl font-semibold mb-2">Full Menu</h2>
          <p className="text-gray-600">Fresh seafood, combos, sides & more</p>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
          {menu.map((item, i) => (
            <div key={i} className="rounded-xl shadow hover:shadow-lg transition bg-white">
              <div className="relative">
                {item.badge && <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">{item.badge}</span>}
                <img src={item.img} className="w-full h-44 object-cover" />
              </div>
              <div className="p-4">
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
                <p className="font-semibold mt-1">{item.price}</p>

                <div className="mt-3 border-t pt-2">
                  <p className="text-xs text-gray-500 mb-1">Add to your order:</p>
                  <div className="flex flex-wrap gap-2">
                    {addons.map((a, idx) => (
                      <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded">{a.name} {a.price}</span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => (window.location.href = BRAND.orderLink)}
                  className="mt-3 w-full bg-red-600 text-white py-2 rounded-lg text-sm"
                >
                  Add to Order
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 👉 LINK TO FULL ORDER MENU */}
        <div className="text-center mt-10">
          <button
            onClick={() => (window.location.href = BRAND.orderLink)}
            className="bg-blue-900 text-white px-6 py-3 rounded-lg"
          >
            View Full Online Menu
          </button>
        </div>
      </section>

      {/* DEALS */}
      <section id="deals" className="bg-gray-100 py-14 text-center">
        <h2 className="text-2xl font-semibold mb-3">🔥 Family Combo Deals</h2>
        <p className="mb-4">Most customers upgrade to combos and save more</p>
        <button
          onClick={() => (window.location.href = BRAND.orderLink)}
          className="bg-red-600 text-white px-6 py-3 rounded-lg"
        >
          View Combo Deals
        </button>
      </section>

      {/* SMS */}
      <section className="py-14 text-center">
        <h2 className="text-2xl font-semibold mb-3">Get 10% Off Your Next Order</h2>
        {submitted ? (
          <p className="text-green-600">✅ Check your phone!</p>
        ) : (
          <div className="flex justify-center gap-2">
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" className="border px-3 py-2 rounded" />
            <button onClick={handleSMS} className="bg-red-600 text-white px-4 py-2 rounded">Get Code</button>
          </div>
        )}
      </section>

      {/* CASH */}
      <section className="bg-green-50 border-y py-8 text-center">
        <h2 className="text-xl font-semibold mb-1">💵 Pay Cash & Save More</h2>
        <p className="text-gray-700 text-sm">Avoid card fees • Best pricing in-store</p>
      </section>

      {/* CTA */}
      <section className="bg-blue-900 text-white text-center py-14">
        <h2 className="text-2xl font-semibold mb-3">Order Direct. Save More.</h2>
        <button
          onClick={() => (window.location.href = BRAND.orderLink)}
          className="bg-red-600 px-8 py-3 rounded-xl"
        >
          Order Now
        </button>
      </section>

      {/* FOOTER */}
      <footer id="contact" className="text-center text-sm py-8 bg-gray-200 space-y-1">
        <p className="font-medium">📍 {BRAND.address}</p>
        <p>📞 {BRAND.displayPhone}</p>
        <p>✉️ {BRAND.email}</p>
        <p className="mt-3 text-gray-600">© {BRAND.name}</p>
      </footer>

    </div>
  );
}
