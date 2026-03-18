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
    <div className="bg-white text-gray-900 text-lg leading-relaxed">

      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-4 py-4">
          <div className="flex items-center gap-3">
            <img src="/logo.png" className="h-28 w-auto object-contain drop-shadow-xl" />
            <span className="font-semibold text-blue-800 text-2xl tracking-wide">POF Seafood</span>
          </div>

          <nav className="hidden md:flex gap-8 text-base font-medium">
            <a href="#menu" className="hover:text-red-600">Menu</a>
            <a href="#deals" className="hover:text-red-600">Deals</a>
            <a href="#contact" className="hover:text-red-600">Contact</a>
          </nav>

          <button onClick={() => (window.location.href = BRAND.orderLink)} className="bg-red-600 text-white px-6 py-3 rounded-xl text-base">Order Now</button>
        </div>
      </header>

      {/* HERO */}
      <section className="bg-blue-900 text-white text-center py-14 px-4">
        <img src="/logo.png" className="h-44 mx-auto mb-6 object-contain drop-shadow-2xl" />
        <h1 className="text-5xl md:text-6xl font-semibold mb-4 tracking-tight">Fresh Seafood. Better Prices.</h1>
        <p className="text-xl mb-6 opacity-90">Order direct & save money every time</p>
        <button onClick={() => (window.location.href = BRAND.orderLink)} className="bg-red-600 px-8 py-4 rounded-xl text-lg">Order Now</button>
      </section>

      {/* CASH TOP */}
      <section className="bg-green-50 border-y py-8 text-center">
        <h2 className="text-2xl font-semibold mb-2">💵 Pay Cash & Save More</h2>
        <p className="text-base text-gray-700">Avoid card fees • Best pricing in-store</p>
      </section>

      {/* VALUE */}
      <section className="py-12 text-center">
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8 text-base">
          <div>💰 Save $3–$5 per order</div>
          <div>⚡ Faster than DoorDash</div>
          <div>🎁 Exclusive deals</div>
        </div>
      </section>

      {/* MENU */}
      <section id="menu" className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto text-center mb-10">
          <h2 className="text-4xl font-semibold mb-3">Full Menu</h2>
          <p className="text-lg text-gray-600">Fresh seafood, combos, sides & more</p>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {menu.map((item, i) => (
            <div key={i} className="rounded-xl shadow hover:shadow-lg transition bg-white">
              <img src={item.img} className="w-full h-52 object-cover" />
              <div className="p-5">
                <h3 className="font-semibold text-xl">{item.name}</h3>
                <p className="text-gray-600">{item.desc}</p>
                <p className="font-semibold text-lg mt-2">{item.price}</p>

                <div className="mt-4 border-t pt-3">
                  <p className="text-sm text-gray-500 mb-2">Add to your order:</p>
                  <div className="flex flex-wrap gap-2">
                    {addons.map((a, idx) => (
                      <span key={idx} className="text-sm bg-gray-100 px-2 py-1 rounded">{a.name} {a.price}</span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => (window.location.href = BRAND.orderLink)}
                  className="mt-4 w-full bg-red-600 text-white py-3 rounded-lg text-base"
                >
                  Add to Order
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <button
            onClick={() => (window.location.href = BRAND.orderLink)}
            className="bg-blue-900 text-white px-8 py-4 rounded-lg text-lg"
          >
            View Full Online Menu
          </button>
        </div>
      </section>

      {/* DEALS */}
      <section id="deals" className="bg-gray-100 py-16 text-center">
        <h2 className="text-3xl font-semibold mb-4">🔥 Family Combo Deals</h2>
        <p className="text-lg mb-6">Most customers upgrade to combos and save more</p>
        <button
          onClick={() => (window.location.href = BRAND.orderLink)}
          className="bg-red-600 text-white px-8 py-4 rounded-lg text-lg"
        >
          View Combo Deals
        </button>
      </section>

      {/* SMS */}
      <section className="py-16 text-center">
        <h2 className="text-3xl font-semibold mb-4">Get 10% Off Your Next Order</h2>
        {submitted ? (
          <p className="text-green-600 text-lg">✅ Check your phone!</p>
        ) : (
          <div className="flex justify-center gap-2">
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" className="border px-4 py-3 rounded text-base" />
            <button onClick={handleSMS} className="bg-red-600 text-white px-6 py-3 rounded text-base">Get Code</button>
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="bg-blue-900 text-white text-center py-16">
        <h2 className="text-3xl font-semibold mb-4">Order Direct. Save More.</h2>
        <button
          onClick={() => (window.location.href = BRAND.orderLink)}
          className="bg-red-600 px-10 py-5 rounded-xl text-lg"
        >
          Order Now
        </button>
      </section>

      {/* FOOTER */}
      <footer id="contact" className="text-center text-base py-10 bg-gray-200 space-y-2">
        <p className="font-medium">📍 {BRAND.address}</p>
        <p>📞 {BRAND.displayPhone}</p>
        <p>✉️ {BRAND.email}</p>
        <p className="mt-3 text-gray-600">© {BRAND.name}</p>
      </footer>

    </div>
  );
}