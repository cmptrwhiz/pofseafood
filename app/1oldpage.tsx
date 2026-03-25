"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion"; // Note: Use 'framer-motion' for standard Next.js setups
import { ShoppingCart, Phone, MapPin, Mail, Clock, CheckCircle2, DollarSign, Zap, Gift, Menu as MenuIcon, X } from "lucide-react";

const BRAND = {
  name: "Plenty of Fish Seafood",
  orderLink: "https://orderplentyoffishseafood.com/order",
  phone: "tel:+16614719620",
  displayPhone: "661.471.9620",
  address: "43937 15th Street West, Lancaster, CA 93534",
  email: "info@orderplentyoffishseafood.com",
  status: "Open • Closes 9PM",
  videoUrl: "/PlentyOfFishVideo.mp4",
};

const menuItems = [
  { name: "Shrimp Basket", desc: "Crispy shrimp, fries, house sauce", price: "$15.99", img: "/images/shrimp.png" },
  { name: "Fish & Chips", desc: "Golden fried fish, seasoned fries", price: "$14.99", img: "/images/fish.png" },
  { name: "Seafood Combo", desc: "Best value combo (Save $5)", price: "$19.99", img: "/images/combo.png", badge: "Best Value" }
];

export default function Page() {
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSMS = async () => {
    if (!phone) return;
    setSubmitted(true);
    // Add your SMS API logic here
  };

  return (
    <main className="min-h-screen font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900 relative overflow-hidden">
      {/* UNDERWATER BACKGROUND VISUALS */}
      <div className="fixed inset-0 pointer-events-none z-[-1]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#001233] via-[#002855] to-[#0466c8]"></div>
        <div className="absolute inset-0 shimmer-bg bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.1),transparent_70%)]"></div>
        
        <div className="light-ray" style={{ animationDelay: '0s' }}></div>
        <div className="light-ray" style={{ animationDelay: '4s', left: '-20%' }}></div>
        <div className="light-ray" style={{ animationDelay: '8s', left: '20%' }}></div>
        
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="bubble"
            style={{
              width: `${Math.random() * 30 + 5}px`,
              height: `${Math.random() * 30 + 5}px`,
              left: `${Math.random() * 100}%`,
              bottom: `-50px`,
              animationDuration: `${Math.random() * 12 + 8}s`,
              animationDelay: `${Math.random() * 15}s`,
              opacity: Math.random() * 0.4 + 0.1
            }}
          />
        ))}

        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[10%] left-[5%] w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute top-[40%] right-[10%] w-[600px] h-[600px] bg-cyan-400/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-[20%] left-[15%] w-[400px] h-[400px] bg-blue-300/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>
      </div>
      
      {/* TOP BAR */}
      <div className="bg-blue-950 text-white text-[10px] sm:text-xs py-1.5 px-4 text-center font-medium tracking-wider uppercase">
        <span className="opacity-80">⚡ Faster than DoorDash • </span>
        <span className="text-emerald-400">Pay Cash & Save $3-$5 Per Order</span>
      </div>

      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-blue-950/80 backdrop-blur-md border-b border-white/10 shadow-lg h-14">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 h-full relative">
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="relative w-16 h-16 sm:w-24 sm:h-24 flex-shrink-0">
              <img 
                src="https://storage.googleapis.com/static.fast.ai/files/PlentyOfFishLogo.png" 
                alt="POF Logo"
                className="absolute -top-4 sm:-top-8 left-0 h-32 sm:h-52 w-auto object-contain drop-shadow-2xl z-50" 
              />
            </div>
            <span className="font-display text-white text-xl sm:text-3xl tracking-tight mt-1 drop-shadow-lg" style={{ fontFamily: 'var(--font-display)' }}>
              POF SEAFOOD
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-widest text-blue-100">
            <a href="#menu" className="hover:text-white transition-colors">Menu</a>
            <a href="#deals" className="hover:text-white transition-colors">Deals</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
          </nav>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => window.open(BRAND.orderLink, '_blank')}
              className="bg-red-600 hover:bg-red-700 text-white px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-bold uppercase tracking-widest transition-all shadow-lg shadow-red-600/20 active:scale-95 flex items-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Order Now</span>
              <span className="sm:hidden">Order</span>
            </button>
            <button className="md:hidden p-2 text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-8 sm:pt-20 sm:pb-12">
        <div className="relative max-w-7xl mx-auto px-4 z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-center">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left lg:col-span-2"
            >
              <h1 className="font-display text-4xl sm:text-6xl mb-4 leading-tight tracking-tight text-white" style={{ fontFamily: 'var(--font-display)' }}>
                FRESH SEAFOOD.<br />
                <span className="text-red-500">BETTER PRICES.</span>
              </h1>
              <p className="text-lg sm:text-xl mb-8 text-blue-100 font-medium max-w-xl mx-auto lg:mx-0">
                Order direct and save money every time. Skip the expensive apps and keep the cash in your pocket.
              </p>

              {/* INLINE MENU ITEMS */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-10">
                {menuItems.map((item, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 + (i * 0.1) }}
                    className="group rounded-2xl overflow-hidden shadow-md bg-white/80 backdrop-blur-sm border border-white/50 flex flex-col text-left"
                  >
                    <div className="relative h-24 sm:h-32 overflow-hidden">
                      <img src={item.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.name} />
                    </div>
                    <div className="p-3 flex-grow flex flex-col">
                      <h3 className="font-bold text-[10px] sm:text-sm text-slate-900 leading-tight mb-1">{item.name}</h3>
                      <div className="flex justify-between items-center mt-auto">
                        <span className="text-xs sm:text-base font-black text-blue-600">{item.price}</span>
                        <button
                          onClick={() => window.open(BRAND.orderLink, '_blank')}
                          className="bg-blue-900 text-white p-1.5 rounded-lg hover:bg-blue-800 transition-colors"
                        >
                          <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                <button 
                  onClick={() => window.open(BRAND.orderLink, '_blank')}
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-2xl text-lg font-bold uppercase tracking-widest transition-all shadow-xl shadow-red-600/30 active:scale-95"
                >
                  Order Online
                </button>
                <a 
                  href={BRAND.phone}
                  className="bg-blue-900 hover:bg-blue-800 text-white px-8 py-4 rounded-2xl text-lg font-bold uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2 shadow-xl shadow-blue-900/20"
                >
                  <Phone className="w-5 h-5" />
                  Call Now
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative lg:col-span-1"
            >
              <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white aspect-square sm:aspect-video lg:aspect-square bg-slate-100 max-w-[300px] mx-auto lg:ml-auto">
                <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                  <source src={BRAND.videoUrl} type="video/mp4" />
                </video>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Rest of the sections (Value Props, Deals, SMS, Footer) go here... */}
      {/* (Same as the previous App.tsx code) */}
    </main>
  );
}