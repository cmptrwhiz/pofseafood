/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";
import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ShoppingCart, Phone, MapPin, Mail, Clock, CheckCircle2, DollarSign, Zap, Gift, Menu as MenuIcon, X } from "lucide-react";

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

export default function App() {
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // GA initialization would go here in a real app
    console.log("GA Initialized:", BRAND.gaId);
  }, []);

  const handleSMS = async () => {
    if (!phone) return;
    try {
      await fetch("/api/sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone })
      });
      setSubmitted(true);
    } catch (err) {
      console.error("SMS failed", err);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100">
      
      {/* TOP BAR */}
      <div className="bg-blue-950 text-white text-[10px] sm:text-xs py-1.5 px-4 text-center font-medium tracking-wider uppercase">
        <span className="opacity-80">⚡ Faster than DoorDash • </span>
        <span className="text-emerald-400">Pay Cash & Save $3-$5 Per Order</span>
      </div>

      {/* HEADER - Reduced height (h-14) */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm h-14">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 h-full relative">
          
          {/* LOGO - Independent & Larger */}
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="relative w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0">
           <img 
          src="/logo.png" 
          className="absolute -top-6 left-0 h-28 w-auto object-contain drop-shadow-xl" 
        />
            </div>
            <span className="font-display text-blue-900 text-xl sm:text-3xl tracking-tight mt-1">
              POF SEAFOOD
            </span>
          </div>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-widest text-slate-600">
            <a href="#menu" className="hover:text-red-600 transition-colors">Menu</a>
            <a href="#deals" className="hover:text-red-600 transition-colors">Deals</a>
            <a href="#contact" className="hover:text-red-600 transition-colors">Contact</a>
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => window.open(BRAND.orderLink, '_blank')}
              className="bg-red-600 hover:bg-red-700 text-white px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-bold uppercase tracking-widest transition-all shadow-lg shadow-red-600/20 active:scale-95 flex items-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Order Now</span>
              <span className="sm:hidden">Order</span>
            </button>
            <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {/* MOBILE NAV */}
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-14 left-0 w-full bg-white border-b shadow-xl md:hidden py-6 flex flex-col items-center gap-4 font-bold uppercase tracking-widest"
          >
            <a href="#menu" onClick={() => setIsMenuOpen(false)}>Menu</a>
            <a href="#deals" onClick={() => setIsMenuOpen(false)}>Deals</a>
            <a href="#contact" onClick={() => setIsMenuOpen(false)}>Contact</a>
          </motion.div>
        )}
      </header>

      {/* HERO - White background to prevent blue from overpowering */}
      <section className="relative bg-white text-slate-900 overflow-hidden border-b border-slate-100">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:30px_30px]"></div>
        </div>

        <div className="relative max-w-5xl mx-auto text-center py-4 sm:py-6 px-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* HERO IMAGE - Even Smaller as requested */}
       <img src="/logo.png" className="h-44 mx-auto mb-6 object-contain drop-shadow-2xl" />
            <h1 className="font-display text-4xl sm:text-6xl md:text-7xl mb-6 leading-tight tracking-tight">
              <span className="bg-red-600 text-white px-6 py-2 rounded-[2rem] inline-block shadow-xl shadow-red-600/20">
                FRESH SEAFOOD.<br/>BETTER PRICES.
              </span>
            </h1>
            <p className="text-base sm:text-xl mb-8 text-slate-600 font-medium max-w-2xl mx-auto">
              Order direct and save money every time. Skip the apps, keep the cash.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={() => window.open(BRAND.orderLink, '_blank')}
                className="bg-red-600 hover:bg-red-700 text-white px-10 py-4 rounded-2xl text-xl font-bold uppercase tracking-widest transition-all shadow-xl shadow-red-600/30 active:scale-95"
              >
                Order Online Now
              </button>
              <a 
                href={BRAND.phone}
                className="bg-blue-900 hover:bg-blue-800 text-white px-10 py-4 rounded-2xl text-xl font-bold uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2 shadow-xl shadow-blue-900/20"
              >
                <Phone className="w-5 h-5" />
                Call To Order
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CASH SAVINGS BANNER */}
      <section className="bg-emerald-50 border-y border-emerald-100 py-6 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-xl sm:text-2xl font-bold text-emerald-900 flex items-center justify-center gap-2">
            <DollarSign className="w-6 h-6" />
            PAY CASH & SAVE MORE
          </h2>
          <p className="text-emerald-700 font-medium mt-1">Avoid card fees • Get our best pricing in-store</p>
        </div>
      </section>

      {/* VALUE PROPS */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: <DollarSign className="w-8 h-8 text-emerald-500" />, title: "Save $3–$5 Per Order", desc: "Lower prices than third-party apps" },
            { icon: <Zap className="w-8 h-8 text-amber-500" />, title: "Faster Than DoorDash", desc: "Ready for pickup in 15-20 minutes" },
            { icon: <Gift className="w-8 h-8 text-red-500" />, title: "Exclusive Deals", desc: "Combos you won't find anywhere else" }
          ].map((prop, i) => (
            <div key={i} className="flex flex-col items-center text-center p-6 rounded-3xl bg-slate-50 border border-slate-100">
              <div className="mb-4 p-3 bg-white rounded-2xl shadow-sm">{prop.icon}</div>
              <h3 className="text-lg font-bold uppercase tracking-wider mb-2">{prop.title}</h3>
              <p className="text-slate-600 text-sm">{prop.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* MENU */}
      <section id="menu" className="py-20 px-4 bg-slate-50">
        <div className="max-w-5xl mx-auto text-center mb-12">
          <h2 className="font-display text-4xl sm:text-6xl text-blue-900 mb-4">OUR FULL MENU</h2>
          <p className="text-lg text-slate-600 font-medium">Fresh seafood, combos, sides & more</p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {menuItems.map((item, i) => (
            <motion.div 
              key={i} 
              whileHover={{ y: -10 }}
              className="group rounded-[2rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all bg-white border border-slate-100 flex flex-col"
            >
              <div className="relative h-64 overflow-hidden">
                <img src={item.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                {item.badge && (
                  <span className="absolute top-4 right-4 bg-amber-400 text-amber-950 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest shadow-lg">
                    {item.badge}
                  </span>
                )}
              </div>
              <div className="p-8 flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-2xl text-slate-900">{item.name}</h3>
                  <span className="text-xl font-black text-blue-600">{item.price}</span>
                </div>
                <p className="text-slate-500 mb-6">{item.desc}</p>

                <div className="mt-auto">
                  <div className="bg-slate-50 rounded-2xl p-4 mb-6">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Add-ons:</p>
                    <div className="flex flex-wrap gap-2">
                      {addons.map((a, idx) => (
                        <span key={idx} className="text-xs bg-white border border-slate-200 px-3 py-1.5 rounded-xl font-bold text-slate-700">
                          {a.name} <span className="text-blue-600">{a.price}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => window.open(BRAND.orderLink, '_blank')}
                    className="w-full bg-blue-900 hover:bg-blue-800 text-white py-4 rounded-2xl font-bold uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Add to Order
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-16">
          <button
            onClick={() => window.open(BRAND.orderLink, '_blank')}
            className="bg-white text-blue-900 border-2 border-blue-900 px-12 py-5 rounded-2xl text-xl font-bold uppercase tracking-widest hover:bg-blue-50 transition-all active:scale-95"
          >
            View Full Online Menu
          </button>
        </div>
      </section>

      {/* DEALS */}
      <section id="deals" className="relative py-24 bg-red-600 text-white overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
           <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        </div>
        <div className="relative max-w-4xl mx-auto text-center px-4">
          <h2 className="font-display text-5xl sm:text-7xl mb-6">FAMILY COMBO DEALS</h2>
          <p className="text-xl sm:text-2xl mb-10 font-medium opacity-90">
            Most customers upgrade to combos and save even more. Feed the whole crew for less!
          </p>
          <button
            onClick={() => window.open(BRAND.orderLink, '_blank')}
            className="bg-white text-red-600 px-12 py-6 rounded-2xl text-2xl font-black uppercase tracking-widest shadow-2xl hover:bg-slate-50 transition-all active:scale-95"
          >
            View Combo Deals
          </button>
        </div>
      </section>

      {/* SMS OPT-IN */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="inline-block p-4 bg-blue-50 rounded-3xl mb-6">
            <Gift className="w-10 h-10 text-blue-600" />
          </div>
          <h2 className="font-display text-4xl sm:text-5xl text-slate-900 mb-4">GET 10% OFF</h2>
          <p className="text-xl text-slate-600 mb-10 font-medium">Join our VIP list for exclusive weekly deals and a 10% discount code instantly.</p>
          
          {submitted ? (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-emerald-50 border border-emerald-100 p-8 rounded-[2rem] flex flex-col items-center gap-4"
            >
              <CheckCircle2 className="w-12 h-12 text-emerald-500" />
              <p className="text-emerald-900 text-2xl font-bold">Check your phone! Your code is on the way.</p>
            </motion.div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input 
                type="tel"
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                placeholder="Enter Phone Number" 
                className="flex-grow bg-slate-50 border-2 border-slate-100 px-6 py-4 rounded-2xl text-lg focus:outline-none focus:border-blue-500 transition-colors" 
              />
              <button 
                onClick={handleSMS} 
                className="bg-blue-900 hover:bg-blue-800 text-white px-8 py-4 rounded-2xl text-lg font-bold uppercase tracking-widest transition-all active:scale-95"
              >
                Get Code
              </button>
            </div>
          )}
          <p className="mt-6 text-xs text-slate-400">By signing up, you agree to receive automated marketing text messages. Msg & data rates may apply.</p>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-blue-900 text-white text-center py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4">
         <img src="/logo.png" className="h-44 mx-auto mb-6 object-contain drop-shadow-2xl" />
          <h2 className="font-display text-4xl sm:text-6xl mb-6 leading-tight uppercase">ORDER DIRECT.<br/>SAVE MORE.</h2>
          <button
            onClick={() => window.open(BRAND.orderLink, '_blank')}
            className="bg-red-600 hover:bg-red-700 text-white px-12 py-5 rounded-2xl text-2xl font-black uppercase tracking-widest shadow-2xl shadow-red-600/40 transition-all active:scale-95"
          >
            Order Now
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="contact" className="bg-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-4 mb-6">
            <img src="/logo.png" className="h-44 mx-auto mb-6 object-contain drop-shadow-2xl" />
              <span className="font-display text-3xl tracking-tight">POF SEAFOOD</span>
            </div>
            <p className="text-slate-400 max-w-sm mb-8">
              Lancaster's favorite spot for fresh, crispy, and delicious seafood. We believe in better quality at better prices.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
                <span className="sr-only">Facebook</span>
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path></svg>
              </a>
              <a href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
                <span className="sr-only">Instagram</span>
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path></svg>
              </a>
            </div>
          </div>
          
          <div className="space-y-6">
            <h4 className="text-lg font-bold uppercase tracking-widest">Contact Us</h4>
            <ul className="space-y-4 text-slate-400">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <span>{BRAND.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <a href={BRAND.phone} className="hover:text-white transition-colors">{BRAND.displayPhone}</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <a href={`mailto:${BRAND.email}`} className="hover:text-white transition-colors">{BRAND.email}</a>
              </li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-lg font-bold uppercase tracking-widest">Hours</h4>
            <ul className="space-y-4 text-slate-400">
              <li className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <span>Mon - Sat: 11AM - 9PM</span>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-slate-600 flex-shrink-0" />
                <span>Sunday: Closed</span>
              </li>
              <li className="mt-4">
                <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                  {BRAND.status}
                </span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 mt-20 pt-8 border-t border-white/5 text-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} {BRAND.name}. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}
