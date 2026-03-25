"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Phone, MapPin, Mail, Clock, CheckCircle2, DollarSign, Zap, Gift, Menu as MenuIcon, X } from "lucide-react";

/* ---------------- BRAND ---------------- */
const BRAND = {
  name: "Plenty of Fish Seafood",
  orderLink: "https://orderplentyoffishseafood.com/order",
  phone: "tel:+16614719620",
  displayPhone: "661.471.9620",
  address: "43937 15th Street West, Lancaster, CA",
  email: "info@orderplentyoffishseafood.com",
  status: "Open • Closes 9PM",
};

/* ---------------- DATA ---------------- */
const menuItems = [
  {
    name: "Fish & Shrimp Combo",
    price: "$24.91",
    desc: "Crispy fish + shrimp with fries",
    img: "/hero-food.png",
    badge: "Best Seller"
  },
  {
    name: "Fish & Oysters",
    price: "$22.99",
    desc: "Golden fried oysters + fish",
    img: "/hero-food.png"
  },
  {
    name: "Family Combo",
    price: "$49.99",
    desc: "Feed the whole crew",
    img: "/hero-food.png"
  }
];

const addons = [
  { name: "Fries", price: "+$3" },
  { name: "Coleslaw", price: "+$2" },
];

/* ---------------- PAGE ---------------- */
export default function Page() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleSMS = () => {
    if (!phone) return;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen font-sans text-white relative overflow-x-hidden bg-[#001233]">

      {/* ---------- BUBBLE BACKGROUND ---------- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#001233] via-[#002855] to-[#0466c8]" />

        {mounted && [...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white/10 rounded-full animate-bubble"
            style={{
              width: `${Math.random() * 20 + 5}px`,
              height: `${Math.random() * 20 + 5}px`,
              left: `${Math.random() * 100}%`,
              bottom: `-20px`,
              animationDuration: `${Math.random() * 10 + 10}s`,
              animationDelay: `${Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      {/* ---------- CONTENT ---------- */}
      <div className="relative z-10">

        {/* HEADER */}
        <header className="sticky top-0 z-50 bg-blue-950/80 backdrop-blur-md border-b border-white/10 h-14">
          <div className="max-w-7xl mx-auto flex justify-between items-center px-4 h-full">
            <span className="font-bold text-xl">POF SEAFOOD</span>

            <div className="flex items-center gap-3">
              <button
                onClick={() => window.open(BRAND.orderLink, "_blank")}
                className="bg-red-600 px-4 py-2 rounded-full font-bold"
              >
                Order
              </button>

              <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X /> : <MenuIcon />}
              </button>
            </div>
          </div>
        </header>

        {/* HERO */}
        <section className="pt-20 pb-24 text-center px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            FRESH SEAFOOD
            <br />
            <span className="text-red-500">BETTER PRICES</span>
          </h1>

          <p className="text-blue-100 mb-8 max-w-xl mx-auto">
            Order direct and save. Skip the apps.
          </p>

          <button
            onClick={() => window.open(BRAND.orderLink, "_blank")}
            className="bg-red-600 px-10 py-4 rounded-xl text-lg font-bold"
          >
            Order Online
          </button>
        </section>

        {/* VALUE PROPS */}
        <section className="py-12 grid md:grid-cols-3 gap-6 px-4 max-w-6xl mx-auto">
          {[
            { icon: <DollarSign />, text: "Save $3–$5 per order" },
            { icon: <Zap />, text: "Faster than apps" },
            { icon: <Gift />, text: "Exclusive deals" }
          ].map((item, i) => (
            <div key={i} className="bg-white/10 p-6 rounded-xl text-center">
              <div className="mb-3 flex justify-center">{item.icon}</div>
              <p>{item.text}</p>
            </div>
          ))}
        </section>

        {/* MENU */}
        <section className="py-20 px-4 max-w-6xl mx-auto">
          <h2 className="text-4xl text-center mb-10">MENU</h2>

          <div className="grid md:grid-cols-3 gap-6">
            {menuItems.map((item, i) => (
              <div key={i} className="bg-white text-black rounded-xl overflow-hidden">
                <img src={item.img} className="h-48 w-full object-cover" />
                <div className="p-4">
                  <h3 className="font-bold text-lg">{item.name}</h3>
                  <p className="text-sm">{item.desc}</p>
                  <p className="font-bold mt-2">{item.price}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SMS */}
        <section className="py-20 text-center px-4">
          <h2 className="text-3xl mb-4">Get 10% Off</h2>

          {submitted ? (
            <p className="text-green-400">Check your phone!</p>
          ) : (
            <div className="flex gap-2 justify-center">
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone"
                className="px-4 py-3 rounded text-black"
              />
              <button
                onClick={handleSMS}
                className="bg-blue-600 px-4 py-3 rounded"
              >
                Submit
              </button>
            </div>
          )}
        </section>

        {/* FOOTER */}
        <footer className="bg-black py-12 text-center text-sm">
          <p>{BRAND.address}</p>
          <p>{BRAND.displayPhone}</p>
          <p className="mt-4 opacity-50">© {new Date().getFullYear()} {BRAND.name}</p>
        </footer>

      </div>

      {/* ---------- BUBBLE ANIMATION ---------- */}
      <style jsx>{`
        .animate-bubble {
          animation: bubble linear infinite;
        }

        @keyframes bubble {
          0% { transform: translateY(0); opacity: 0; }
          50% { opacity: 0.4; }
          100% { transform: translateY(-120vh); opacity: 0; }
        }
      `}</style>

    </div>
  );
}