/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingCart, Phone, MapPin, Mail, Clock, CheckCircle2, DollarSign, Zap, Gift, Menu as MenuIcon, X } from "lucide-react";
import FullMenu from "./components/FullMenu";
import {
  FALLBACK_FEATURED_MENU_ITEMS,
  FALLBACK_FULL_MENU,
  type DisplayMenuCategory,
  type DisplayMenuItem,
} from "@/lib/menu";

const CONSENT_TEXT_VERSION = "checkout-consent-v1";

const BRAND = {
  name: "Plenty of Fish Seafood",
  orderLink: "https://orderplentyoffishseafood.com/order",
  phone: "tel:+16614719620",
  displayPhone: "661.471.9620",
  address: "43937 15th Street West, Lancaster, CA 93534",
  email: "info@orderplentyoffishseafood.com",
  gaId: "G-XXXXXXXXXX",
  videoUrl: "/PlentyOfFishVideo.mp4",
};

const testimonials = [
  { name: "Marcus T.", text: "Best fried catfish in the AV. Period. The breading is light and perfectly seasoned.", stars: 5 },
  { name: "Sarah L.", text: "The family combos are a lifesaver. Feed 4 people for way less than anywhere else.", stars: 5 },
  { name: "David R.", text: "Direct ordering was so easy. Saved $6 compared to my last DoorDash order!", stars: 5 }
];

const addons = [
  { name: "Extra Shrimp", price: "+$4" },
  { name: "Large Fries", price: "+$3" },
  { name: "Drink", price: "+$2" }
];

const mondayMadnessItems = [
  {
    title: "50% Off Lunches",
    detail: "Every Monday from 11:00 AM to 2:00 PM at our Lancaster location.",
    value: "Half Off",
  },
  {
    title: "Jumbo Shrimp Deals",
    detail: "Discounted jumbo shrimp plates and jumbo shrimp lunch combinations.",
    value: "Limited Time",
  },
  {
    title: "Handfilled Nuggets",
    detail: "Often featured as a $10 special with catfish, snapper, or salmon.",
    value: "$10 Special",
  },
];

const HEADER_LOGO_SRC = "/logo.png";
const RUNNER_MASCOT_SRC = "/old logo-final.png";

export default function App() {
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [view, setView] = useState<"home" | "menu" | "checkout">("home");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [cart, setCart] = useState<{ name: string; price: number; quantity: number }[]>([]);
  const [featuredMenuItems, setFeaturedMenuItems] = useState<DisplayMenuItem[]>(
    FALLBACK_FEATURED_MENU_ITEMS
  );
  const [fullMenuData, setFullMenuData] = useState<DisplayMenuCategory[]>(
    FALLBACK_FULL_MENU
  );
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orderInfo, setOrderInfo] = useState({
    name: "",
    phone: "",
    email: "",
    time: "",
    smsConsent: false,
    emailConsent: false,
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [lastOrder, setLastOrder] = useState<{
    name: string;
    phone: string;
    email?: string;
    time: string;
    smsConsent: boolean;
    emailConsent: boolean;
    automation: {
      orderReceivedSmsQueued: boolean;
      readySmsEligible: boolean;
      promoSmsEligible: boolean;
    };
    items: { name: string; quantity: number; price: number }[];
    total: number;
  } | null>(null);

  const addToCart = (item: DisplayMenuItem) => {
    const priceNum = parseFloat(item.price.replace('$', ''));
    setCart(prev => {
      const existing = prev.find(i => i.name === item.name);
      if (existing) {
        return prev.map(i => i.name === item.name ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { name: item.name, price: priceNum, quantity: 1 }];
    });
    // Don't auto-open on mobile to avoid blocking view
    if (window.innerWidth > 768) setIsCartOpen(true);
  };

  const removeFromCart = (name: string) => {
    setCart(prev => prev.filter(i => i.name !== name));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    let isActive = true;

    const loadMenu = async () => {
      try {
        const response = await fetch("/api/menu", { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Menu request failed");
        }

        const data = (await response.json()) as {
          featuredItems?: DisplayMenuItem[];
          fullMenu?: DisplayMenuCategory[];
        };

        if (!isActive) {
          return;
        }

        if (Array.isArray(data.featuredItems) && data.featuredItems.length > 0) {
          setFeaturedMenuItems(data.featuredItems);
        }

        if (Array.isArray(data.fullMenu) && data.fullMenu.length > 0) {
          setFullMenuData(data.fullMenu);
        }
      } catch (error) {
        console.error("menu-load-failed", error);
      }
    };

    loadMenu();

    return () => {
      isActive = false;
    };
  }, []);

  const getStatus = () => {
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();
    if (day === 0) return { open: false, msg: "Closed • Opens Mon 11AM" };
    if (hour >= 11 && hour < 21) return { open: true, msg: "Open Now • Closes 9PM" };
    return { open: false, msg: "Closed • Opens 11AM" };
  };

  const status = getStatus();

  useEffect(() => {
    if (view === "menu") {
      window.scrollTo(0, 0);
    }
  }, [view]);

  const handleJoinList = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!phone && !email) return;
    try {
      await fetch("/api/sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, email })
      });
      setSubmitted(true);
      setPhone("");
      setEmail("");
    } catch (err) {
      console.error("Join list failed", err);
    }
  };

  const handlePlaceOrder = async () => {
    if (!orderInfo.name || !orderInfo.phone || !orderInfo.time) {
      alert("Please provide your name, phone number, and pickup time.");
      return;
    }

    setIsPlacingOrder(true);

    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            name: orderInfo.name,
            phone: orderInfo.phone,
            email: orderInfo.email || null,
          },
          consents: {
            sms: orderInfo.smsConsent,
            email: orderInfo.emailConsent,
            textVersion: CONSENT_TEXT_VERSION,
          },
          order: {
            pickupTime: orderInfo.time,
            total: cartTotal,
            items: cart,
            fulfillmentType: "pickup",
          },
          session: {
            referrer: typeof document !== "undefined" ? document.referrer || null : null,
            path: typeof window !== "undefined" ? window.location.pathname : "/",
            deviceType: typeof window !== "undefined" && window.innerWidth < 768 ? "mobile" : "desktop",
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Order submission failed");
      }

      setLastOrder({
        name: orderInfo.name,
        phone: orderInfo.phone,
        email: orderInfo.email || undefined,
        time: orderInfo.time,
        smsConsent: orderInfo.smsConsent,
        emailConsent: orderInfo.emailConsent,
        automation: data.automation,
        items: [...cart],
        total: cartTotal,
      });
      setShowSuccessModal(true);
      setCart([]);
      setOrderInfo({
        name: "",
        phone: "",
        email: "",
        time: "",
        smsConsent: false,
        emailConsent: false,
      });
    } catch (err) {
      console.error("Checkout failed", err);
      alert("We couldn't submit the order right now. Please try again.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="min-h-screen font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900 relative overflow-hidden">
      {/* CART DRAWER */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-blue-950 shadow-2xl z-[201] flex flex-col"
            >
              <div className="p-6 border-b border-white/10 flex justify-between items-center">
                <h2 className="text-2xl font-display text-white uppercase">Your Catch</h2>
                <button onClick={() => setIsCartOpen(false)} className="text-white/60 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto p-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center py-20">
                    <ShoppingCart className="w-16 h-16 text-white/10 mx-auto mb-4" />
                    <p className="text-blue-100/40">Your cart is empty.</p>
                    <button 
                      onClick={() => { setIsCartOpen(false); setView("menu"); }}
                      className="mt-6 text-blue-400 font-bold uppercase tracking-widest text-sm"
                    >
                      Browse Menu
                    </button>
                  </div>
                ) : (
                  cart.map((item, i) => (
                    <div key={i} className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/10">
                      <div>
                        <h4 className="font-bold text-white">{item.name}</h4>
                        <p className="text-blue-100/60 text-sm">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-black text-white">${(item.price * item.quantity).toFixed(2)}</span>
                        <button onClick={() => removeFromCart(item.name)} className="text-red-400 hover:text-red-300">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-6 border-t border-white/10 space-y-4">
                  <div className="flex justify-between text-xl font-display text-white uppercase">
                    <span>Total</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <button 
                    onClick={() => { setIsCartOpen(false); setView("checkout"); }}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-red-600/20 transition-all active:scale-95"
                  >
                    Checkout Now
                  </button>
                  <p className="text-[10px] text-center text-emerald-400 font-bold uppercase tracking-widest">
                    Pay Cash at Pickup & Save $3!
                  </p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {view === "home" ? (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.img
              src={RUNNER_MASCOT_SRC}
              alt=""
              aria-hidden="true"
              initial={{ x: "-14vw", y: "73vh", opacity: 1, rotate: -8 }}
              animate={{
                x: ["-14vw", "18vw", "38vw", "10vw"],
                y: ["73vh", "72vh", "75vh", "73vh"],
                rotate: [-8, 4, -5, -8],
                scale: [1, 1.05, 0.98, 1],
              }}
              transition={{ duration: 7.5, repeat: Infinity, repeatDelay: 1.2, ease: "easeInOut" }}
              className="pointer-events-none fixed left-0 top-0 z-[60] w-24 select-none drop-shadow-[0_22px_28px_rgba(0,18,51,0.45)] sm:w-28 lg:w-32"
            />
            {/* UNDERWATER BACKGROUND VISUALS */}
      <div className="fixed inset-0 pointer-events-none z-[-1]">
        {/* Deep Sea Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#001233] via-[#002855] to-[#0466c8]"></div>
        
        {/* Shimmering Overlay */}
        <div className="absolute inset-0 shimmer-bg bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.1),transparent_70%)]"></div>

        {/* Light Rays */}
        <div className="light-ray" style={{ animationDelay: '0s' }}></div>
        <div className="light-ray" style={{ animationDelay: '4s', left: '-20%' }}></div>
        <div className="light-ray" style={{ animationDelay: '8s', left: '20%' }}></div>
        
        {/* Animated Bubbles */}
        {mounted && [...Array(20)].map((_, i) => (
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

        {/* Caustics/Glows */}
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

      {/* HEADER - Reduced height (h-14) */}
      <header className="sticky top-0 z-50 bg-blue-950/80 backdrop-blur-md border-b border-white/10 shadow-lg h-14">
        {/* Scroll Progress Bar */}
        <div 
          className="absolute top-0 left-0 h-[2px] bg-blue-400 z-[60] transition-all duration-100" 
          style={{ width: `${scrollProgress}%` }}
        />
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 h-full relative">
          
          {/* LOGO - Independent & Much Larger */}
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="relative w-16 h-16 sm:w-24 sm:h-24 flex-shrink-0">
              <img 
                src={HEADER_LOGO_SRC} 
                alt="POF Logo"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://picsum.photos/seed/fish/200/200";
                }}
                className="absolute -top-4 sm:-top-8 left-0 h-32 sm:h-52 w-auto object-contain drop-shadow-2xl z-50" 
              />
            </div>
            <span className="font-display text-white text-xl sm:text-3xl tracking-tight mt-1 drop-shadow-lg">
              Plenty Of Fish Seafood
            </span>
          </div>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-widest text-blue-100">
            <Link href="/menu" className="hover:text-white transition-colors">
              Menu
            </Link>
            <Link href="/location" className="hover:text-white transition-colors">
              Location
            </Link>
            <Link href="/about" className="hover:text-white transition-colors">
              About
            </Link>
            <Link href="/contact" className="hover:text-white transition-colors">
              Contact
            </Link>
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-all"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-blue-950">
                  {cartCount}
                </span>
              )}
            </button>
            <button 
              onClick={() => setView("menu")}
              className="bg-red-600 hover:bg-red-700 text-white px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-bold uppercase tracking-widest transition-all shadow-lg shadow-red-600/20 active:scale-95 flex items-center gap-2"
            >
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
            className="absolute top-14 left-0 w-full bg-blue-950 border-b border-white/10 shadow-xl md:hidden py-8 flex flex-col items-center gap-6 text-sm font-bold uppercase tracking-widest text-blue-100"
          >
            <Link href="/menu" onClick={() => setIsMenuOpen(false)} className="hover:text-white transition-colors">
              Menu
            </Link>
            <Link href="/location" onClick={() => setIsMenuOpen(false)} className="hover:text-white transition-colors">
              Location
            </Link>
            <Link href="/about" onClick={() => setIsMenuOpen(false)} className="hover:text-white transition-colors">
              About
            </Link>
            <Link href="/contact" onClick={() => setIsMenuOpen(false)} className="hover:text-white transition-colors">
              Contact
            </Link>
          </motion.div>
        )}
      </header>

      {/* HERO - Split Layout */}
      <section className="relative overflow-hidden pt-12 pb-8 sm:pt-20 sm:pb-12">
        {/* Floating Action Button (Mobile Only) */}
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setView("menu")}
          className="fixed bottom-6 right-6 z-[100] md:hidden bg-red-600 text-white p-4 rounded-full shadow-2xl flex items-center justify-center border-2 border-white/20"
        >
          <ShoppingCart className="w-6 h-6" />
        </motion.button>
        <div className="relative max-w-7xl mx-auto px-4 z-10">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center justify-center">
            {/* TEXT CONTENT */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left max-w-2xl"
            >
              <h1 className="font-display text-4xl sm:text-7xl mb-4 leading-tight tracking-tight text-white">
                FRE<span className="text-emerald-400">$</span>H SEAFOOD.<br />
                BETTER PRICES.
              </h1>
              <p className="text-lg sm:text-2xl mb-8 text-blue-100 font-medium max-w-2xl mx-auto lg:mx-0">
                Order direct and save money every time. Skip the expensive apps and keep the cash in your pocket.
              </p>

              {/* INLINE MENU ITEMS */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-10">
                {featuredMenuItems.map((item, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ 
                      y: [0, -10, 0],
                      opacity: 1 
                    }}
                    transition={{ 
                      y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 },
                      opacity: { delay: 0.3 + (i * 0.1) }
                    }}
                    className="group rounded-2xl overflow-hidden shadow-md bg-white/80 backdrop-blur-sm border border-white/50 flex flex-col text-left"
                  >
                    <div className="relative h-24 sm:h-32 overflow-hidden">
                      <img src={item.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="p-3 flex-grow flex flex-col">
                      <h3 className="font-bold text-[10px] sm:text-sm text-slate-900 leading-tight mb-1">{item.name}</h3>
                      <div className="flex justify-between items-center mt-auto">
                        <span className="text-xs sm:text-base font-black text-blue-600">{item.price}</span>
                        <button
                          onClick={() => addToCart(item)}
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
                  onClick={() => setView("menu")}
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-2xl text-lg font-bold uppercase tracking-widest transition-all shadow-xl shadow-red-600/30 active:scale-95 flex items-center justify-center gap-3"
                >
                  <ShoppingCart className="w-6 h-6" />
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

              {/* SEAMLESS CONTACT COLLECTION */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="mt-12 p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl max-w-xl mx-auto lg:mx-0"
              >
                {!submitted ? (
                  <form onSubmit={handleJoinList} className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-4 h-4 text-amber-400" />
                      <p className="text-white font-bold uppercase tracking-widest text-xs">Join VIP List for Exclusive Deals</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <div className="flex-grow relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                        <input 
                          type="email" 
                          placeholder="Email Address" 
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-white/10 border border-white/20 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-blue-400 transition-colors text-sm"
                        />
                      </div>
                      <div className="flex-grow relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                        <input 
                          type="tel" 
                          placeholder="Phone Number" 
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full bg-white/10 border border-white/20 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-blue-400 transition-colors text-sm"
                        />
                      </div>
                      <button 
                        type="submit"
                        className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest text-xs transition-all active:scale-95 shadow-lg shadow-emerald-500/20"
                      >
                        Join
                      </button>
                    </div>
                    <p className="text-[10px] text-white/40 uppercase tracking-tighter">By joining, you agree to receive marketing updates. No spam, just fish.</p>
                  </form>
                ) : (
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center py-4"
                  >
                    <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                    <h4 className="text-white font-bold uppercase tracking-widest">You're on the VIP List!</h4>
                    <p className="text-blue-100/60 text-xs mt-1">Check your phone/email for your first deal.</p>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
            {/* DIRECT ORDER ADVANTAGE */}
            <motion.div
              initial={{ x: 44, opacity: 0, scale: 0.96 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="relative w-full max-w-md lg:max-w-sm xl:max-w-md"
            >
              <div className="absolute -inset-6 rounded-[3rem] bg-[radial-gradient(circle_at_70%_20%,rgba(16,185,129,0.22),transparent_42%),radial-gradient(circle_at_15%_85%,rgba(239,68,68,0.18),transparent_38%)] blur-xl" />
              <div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-white/[0.08] p-5 text-white shadow-2xl backdrop-blur-xl">
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-400 via-white to-red-500" />
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="mb-2 text-[10px] font-black uppercase tracking-[0.35em] text-emerald-300">Direct Order Advantage</p>
                    <h2 className="font-display text-3xl uppercase leading-none sm:text-4xl">
                      Save More.
                      <span className="block text-emerald-300">Eat Better.</span>
                    </h2>
                  </div>
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-white/60 bg-slate-100 shadow-lg">
                    <video autoPlay loop muted playsInline className="h-full w-full object-cover">
                      <source src={BRAND.videoUrl} type="video/mp4" />
                    </video>
                    <div className="absolute bottom-1 left-1 rounded-full bg-red-600 px-2 py-0.5 text-[8px] font-black uppercase tracking-widest text-white">
                      Live
                    </div>
                  </div>
                </div>

                <div className="my-5 grid grid-cols-3 gap-2">
                  {[
                    { value: "$3-$5", label: "Cash savings" },
                    { value: "15-20", label: "Min pickup" },
                    { value: "0", label: "App fees" }
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/10 p-3 text-center">
                      <div className="text-lg font-black text-white">{stat.value}</div>
                      <div className="mt-1 text-[9px] font-bold uppercase tracking-wider text-blue-100/60">{stat.label}</div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  {[
                    { icon: <DollarSign className="h-4 w-4" />, text: "Lower direct pricing than third-party apps" },
                    { icon: <Zap className="h-4 w-4" />, text: "Hot pickup orders without delivery delays" },
                    { icon: <Gift className="h-4 w-4" />, text: "VIP deals you only get from us" }
                  ].map((perk) => (
                    <div key={perk.text} className="flex items-center gap-3 rounded-2xl bg-blue-950/35 px-3 py-2 text-sm font-bold text-blue-50">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-400 text-blue-950">
                        {perk.icon}
                      </span>
                      <span>{perk.text}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setView("menu")}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-black uppercase tracking-[0.2em] text-blue-950 shadow-xl transition-all hover:bg-emerald-100 active:scale-95"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Build My Order
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* DEALS SECTION (Formerly Menu Section) */}
      <section id="menu" className="py-12 px-4">
        <div className="max-w-5xl mx-auto text-center mb-10">
          <h2 className="font-display text-4xl sm:text-6xl text-white mb-2">WHY ORDER DIRECT?</h2>
          <p className="text-lg text-blue-100 font-medium">Get the best value and support local business</p>
        </div>
        
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <button
              onClick={() => setView("menu")}
              className="bg-white/10 backdrop-blur-md text-white border-2 border-white/30 px-10 py-4 rounded-2xl text-lg font-bold uppercase tracking-widest hover:bg-white hover:text-blue-950 transition-all active:scale-95"
            >
              View Full Online Menu
            </button>
          </div>
        </div>
      </section>

      {/* CASH SAVINGS BANNER */}
      <section className="bg-emerald-950/40 backdrop-blur-md border-y border-white/10 py-6 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-xl sm:text-2xl font-bold text-emerald-400 flex items-center justify-center gap-2">
            <DollarSign className="w-6 h-6" />
            PAY CASH & SAVE MORE
          </h2>
          <p className="text-emerald-200/70 font-medium mt-1">Avoid card fees • Get our best pricing in-store</p>
        </div>
      </section>

      {/* VALUE PROPS */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: <DollarSign className="w-8 h-8 text-emerald-400" />, title: "Save $3–$5 Per Order", desc: "Lower prices than third-party apps" },
            { icon: <Zap className="w-8 h-8 text-amber-400" />, title: "Faster Than DoorDash", desc: "Ready for pickup in 15-20 minutes" },
            { icon: <Gift className="w-8 h-8 text-red-400" />, title: "Exclusive Deals", desc: "Combos you won't find anywhere else" }
          ].map((prop, i) => (
            <div key={i} className="flex flex-col items-center text-center p-6 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 shadow-xl">
              <div className="mb-4 p-3 bg-white/10 rounded-2xl shadow-sm">{prop.icon}</div>
              <h3 className="text-lg font-bold uppercase tracking-wider mb-2 text-white">{prop.title}</h3>
              <p className="text-blue-100/70 text-sm">{prop.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* MONDAY MADNESS */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-emerald-300 font-black uppercase tracking-[0.35em] text-xs mb-3">Weekly Special</p>
            <h2 className="font-display text-4xl sm:text-6xl text-white uppercase mb-4">MONDAY MADNESS</h2>
            <p className="text-blue-100/60 max-w-3xl mx-auto text-lg">
              Mondays are built for lunch runs, shrimp deals, and fast pickup. Catch the special from 11:00 AM to 2:00 PM.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mondayMadnessItems.map((special, index) => (
              <motion.div
                key={special.title}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.15),transparent_40%)]" />
                <div className="relative">
                  <div className="mb-6 inline-flex rounded-full bg-emerald-400/15 px-3 py-1 text-[10px] font-black uppercase tracking-[0.3em] text-emerald-300">
                    Mondays Only
                  </div>
                  <h3 className="text-2xl font-display text-white uppercase mb-3">{special.title}</h3>
                  <p className="text-blue-100/60 leading-relaxed min-h-[72px]">{special.detail}</p>
                  <div className="mt-8 flex items-center justify-between">
                    <span className="text-2xl font-black text-emerald-400">{special.value}</span>
                    <button
                      onClick={() => setView("menu")}
                      className="rounded-2xl bg-red-600 px-5 py-3 text-sm font-black uppercase tracking-[0.2em] text-white shadow-lg shadow-red-600/25 transition-all hover:bg-red-700 active:scale-95"
                    >
                      View Menu
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAN FAVORITES */}
      <section className="py-24 px-4 bg-blue-950/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl sm:text-6xl text-white uppercase mb-4">FAN FAVORITES</h2>
            <p className="text-blue-100/60 max-w-2xl mx-auto">The items that put us on the map. Fresh, crispy, and always delicious.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {featuredMenuItems.slice(0, 2).map((item, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="group bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-sm hover:bg-white/10 transition-all"
              >
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img 
                    src={item.img} 
                    alt={item.name}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${item.name}/800/600`;
                    }}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-8">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-2xl font-display text-white uppercase">{item.name}</h3>
                    <span className="text-xl font-black text-emerald-400">{item.price}</span>
                  </div>
                  <p className="text-blue-100/50 text-sm mb-8">{item.desc}</p>
                  <button 
                    onClick={() => addToCart(item)}
                    className="w-full bg-white/10 hover:bg-white text-white hover:text-blue-950 py-4 rounded-2xl font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" /> Add to Catch
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CATCH OF THE DAY (Gallery) */}
      <section className="py-24 px-4 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl sm:text-6xl text-white mb-4 uppercase">CATCH OF THE DAY</h2>
            <p className="text-blue-100/60 max-w-2xl mx-auto">Freshly prepared, perfectly seasoned, and served with a smile.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { local: "/Images/Plenty Of Fish-230.jpg", fallback: "https://images.unsplash.com/photo-1559742811-822873691df8?auto=format&fit=crop&w=800&q=80" },
              { local: "/Images/Plenty Of Fish-231.jpg", fallback: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80" },
              { local: "/Images/meal.jpg", fallback: "https://images.unsplash.com/photo-1534604973900-c41ab4c5e636?auto=format&fit=crop&w=800&q=80" },
              { local: "/Images/meal2.jpg", fallback: "https://images.unsplash.com/photo-1551248429-40975aa4de74?auto=format&fit=crop&w=800&q=80" }
            ].map((img, i) => (
              <motion.div 
                key={i}
                whileHover={{ scale: 1.02 }}
                className="aspect-square rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
              >
                <img 
                  src={img.local} 
                  alt="Seafood" 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = img.fallback;
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAVORITES & COMBOS */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl sm:text-6xl text-white uppercase mb-4">FAVORITES & COMBOS</h2>
            <p className="text-blue-100/60 max-w-2xl mx-auto">Upgrade your meal with our signature combos. More food, better value!</p>
          </div>
          <div className="max-w-xl mx-auto">
            {featuredMenuItems.slice(2, 3).map((item, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="group bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-sm hover:bg-white/10 transition-all"
              >
                <div className="aspect-[16/9] overflow-hidden relative">
                  <img 
                    src={item.img} 
                    alt={item.name}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${item.name}/800/600`;
                    }}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    referrerPolicy="no-referrer"
                  />
                  {item.badge && (
                    <div className="absolute top-6 right-6 bg-amber-400 text-blue-950 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                      {item.badge}
                    </div>
                  )}
                </div>
                <div className="p-8">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-3xl font-display text-white uppercase">{item.name}</h3>
                    <span className="text-2xl font-black text-emerald-400">{item.price}</span>
                  </div>
                  <p className="text-blue-100/50 text-lg mb-8">{item.desc}</p>
                  <button 
                    onClick={() => addToCart(item)}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-5 rounded-2xl font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-xl shadow-red-600/20"
                  >
                    <ShoppingCart className="w-5 h-5" /> Add to Catch
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* DEALS SECTION */}
      <section id="deals" className="py-24 px-4 bg-blue-950/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl sm:text-6xl text-white uppercase mb-4">FAMILY COMBO DEALS</h2>
            <p className="text-blue-100/60 max-w-2xl mx-auto">Feed the whole crew with our legendary family packs. The best value in the AV!</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[
              { name: "Family Feast", desc: "8pc Fish, 12pc Shrimp, Large Fries, Large Slaw", price: "$54.99", badge: "Best Seller" },
              { name: "Captain's Platter", desc: "2pc Fish, 4pc Shrimp, 2pc Oysters, and Clam Strips", price: "$28.99" }
            ].map((deal, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="bg-white/5 border border-white/10 p-8 rounded-[2rem] backdrop-blur-sm relative overflow-hidden group"
              >
                {deal.badge && (
                  <div className="absolute top-0 right-0 bg-emerald-500 text-white px-4 py-1 rounded-bl-2xl text-[10px] font-black uppercase tracking-widest">
                    {deal.badge}
                  </div>
                )}
                <h3 className="text-2xl font-display text-white uppercase mb-2">{deal.name}</h3>
                <p className="text-blue-100/50 text-sm mb-6">{deal.desc}</p>
                <div className="flex justify-between items-center">
                  <span className="text-3xl font-black text-white">{deal.price}</span>
                  <button 
                    onClick={() => addToCart(deal)}
                    className="bg-white/10 hover:bg-white text-white hover:text-blue-950 px-6 py-3 rounded-xl font-bold uppercase tracking-widest transition-all"
                  >
                    Add to Order
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 bg-blue-950/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl sm:text-6xl text-white mb-4">WHAT OUR CUSTOMERS ARE SAYING</h2>
            <div className="flex justify-center gap-1">
              {[...Array(5)].map((_, i) => <Zap key={i} className="w-6 h-6 text-amber-400 fill-amber-400" />)}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="bg-white/5 border border-white/10 p-8 rounded-[2rem] backdrop-blur-sm"
              >
                <p className="text-blue-100/80 italic mb-6 text-lg">"{t.text}"</p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">— {t.name}</span>
                  <div className="flex gap-0.5">
                    {[...Array(t.stars)].map((_, j) => <CheckCircle2 key={j} className="w-4 h-4 text-emerald-400" />)}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SMS OPT-IN / VIP CLUB */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-600/5 pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="bg-gradient-to-br from-blue-900 to-blue-950 p-8 sm:p-16 rounded-[3rem] border border-white/10 shadow-2xl text-center">
            {!submitted ? (
              <>
                <div className="inline-block p-4 bg-white/10 rounded-3xl mb-8">
                  <Gift className="w-12 h-12 text-amber-400" />
                </div>
                <h2 className="font-display text-4xl sm:text-6xl text-white mb-6 uppercase">JOIN THE VIP CLUB</h2>
                <p className="text-blue-100/60 text-lg mb-12 max-w-2xl mx-auto">
                  Get exclusive secret menu items, early access to deals, and a special gift on your birthday. 
                  No scrolling required—we'll send the best catches straight to you.
                </p>
                <form onSubmit={handleJoinList} className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
                  <input 
                    type="email" 
                    placeholder="Email Address" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-grow bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-white placeholder:text-white/30 focus:outline-none focus:border-blue-400 transition-all text-lg"
                  />
                  <input 
                    type="tel" 
                    placeholder="Phone Number" 
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="flex-grow bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-white placeholder:text-white/30 focus:outline-none focus:border-blue-400 transition-all text-lg"
                  />
                  <button 
                    type="submit"
                    className="bg-red-600 hover:bg-red-700 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest transition-all active:scale-95 shadow-xl shadow-red-600/20"
                  >
                    Join Now
                  </button>
                </form>
                <p className="text-xs text-white/30 mt-6 uppercase tracking-widest">
                  Secure & Private • Unsubscribe anytime
                </p>
              </>
            ) : (
              <div className="py-12">
                <CheckCircle2 className="w-20 h-20 text-emerald-400 mx-auto mb-8" />
                <h2 className="font-display text-4xl text-white mb-4 uppercase">WELCOME TO THE FAMILY</h2>
                <p className="text-blue-100/60 text-xl">We've sent a confirmation to your phone and email.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FIND US SECTION */}
      <section id="contact" className="py-24 px-4 bg-blue-950/50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-xs font-black uppercase tracking-[0.35em] text-emerald-300">Visit Plenty Of Fish</p>
              <h2 className="font-display text-4xl sm:text-6xl text-white uppercase">FIND US FAST</h2>
              <p className="max-w-2xl text-lg text-blue-100/65">
                Swing by for crispy seafood, quick pickup, and direct-order savings. We made this section more useful so customers can call, map, and head over fast.
              </p>
            </div>
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm shadow-xl">
                <MapPin className="w-8 h-8 text-blue-400 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Our Location</h3>
                  <p className="text-blue-100/70">{BRAND.address}</p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <button 
                      onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(BRAND.address)}`, '_blank')}
                      className="text-blue-400 font-bold uppercase tracking-widest text-sm hover:text-blue-300 transition-colors flex items-center gap-2"
                    >
                      Get Directions <Zap className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(BRAND.address)}`, '_blank')}
                      className="text-white/70 font-bold uppercase tracking-widest text-sm hover:text-white transition-colors"
                    >
                      View Map
                    </button>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4 p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm shadow-xl">
                  <Phone className="w-8 h-8 text-emerald-400 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">Call Ahead</h3>
                    <p className="text-blue-100/70">Skip the wait by calling in your order.</p>
                    <a href={BRAND.phone} className="text-2xl font-black text-white mt-2 block">{BRAND.displayPhone}</a>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm shadow-xl">
                  <Clock className="w-8 h-8 text-amber-300 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">Pickup Hours</h3>
                    <p className="text-blue-100/70">Monday - Saturday</p>
                    <p className="text-2xl font-black text-white mt-2 block">11AM - 9PM</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Pickup", value: "Fast" },
                  { label: "Direct Savings", value: "$3-$5" },
                  { label: "Best For", value: "Combos" },
                  { label: "Order Type", value: "Call or Web" },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-center backdrop-blur-sm">
                    <div className="text-lg font-black text-white">{stat.value}</div>
                    <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-100/55">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="relative aspect-video lg:aspect-square rounded-[3rem] overflow-hidden border-4 border-white/10 shadow-2xl group bg-[radial-gradient(circle_at_20%_20%,rgba(96,165,250,0.25),transparent_30%),linear-gradient(160deg,#18366b_0%,#0b1f47_55%,#08162f_100%)]">
            <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:28px_28px] opacity-50" />
            <div className="absolute inset-0 p-6 sm:p-8">
              <div className="flex h-full flex-col justify-between rounded-[2.3rem] border border-white/10 bg-black/10 p-6 backdrop-blur-[2px]">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.35em] text-emerald-300">Lancaster, California</p>
                  <h3 className="mt-3 text-3xl font-display text-white uppercase leading-none sm:text-4xl">Quick Pickup.<br />Easy Directions.</h3>
                  <p className="mt-4 max-w-sm text-sm text-blue-100/70">
                    Order ahead, head over, and grab your seafood fast. Plenty Of Fish is easy to find and even easier to come back to.
                  </p>
                </div>

                <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-xl">
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-1 h-5 w-5 text-blue-300" />
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.25em] text-white/60">Pickup Destination</p>
                      <p className="mt-2 text-base font-bold text-white">{BRAND.address}</p>
                    </div>
                  </div>
                  <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                    <button 
                      onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(BRAND.address)}`, '_blank')}
                      className="bg-white text-blue-950 px-6 py-4 rounded-2xl font-bold uppercase tracking-widest shadow-2xl hover:scale-[1.02] transition-transform"
                    >
                      Open in Google Maps
                    </button>
                    <a
                      href={BRAND.phone}
                      className="border border-white/20 bg-white/5 px-6 py-4 rounded-2xl font-bold uppercase tracking-widest text-white text-center hover:bg-white/10 transition-colors"
                    >
                      Call Before You Go
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-blue-900 text-white text-center py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <img 
            src={HEADER_LOGO_SRC} 
            className="h-48 sm:h-72 mx-auto mb-8 object-contain drop-shadow-2xl" 
          />
          <h2 className="font-display text-4xl sm:text-6xl mb-6 leading-tight uppercase">ORDER DIRECT.<br/>SAVE MORE.</h2>
          <button
            onClick={() => setView("menu")}
            className="bg-red-600 hover:bg-red-700 text-white px-12 py-5 rounded-2xl text-2xl font-black uppercase tracking-widest shadow-2xl shadow-red-600/40 transition-all active:scale-95 flex items-center justify-center gap-4"
          >
            <ShoppingCart className="w-8 h-8" />
            Order Now
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="contact" className="bg-black/40 backdrop-blur-xl text-white py-20 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-4 mb-6">
              <img 
                src={HEADER_LOGO_SRC} 
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://picsum.photos/seed/fish/100/100";
                }}
                className="h-24 sm:h-32 w-auto object-contain" 
              />
              <span className="font-display text-3xl tracking-tight">POF SEAFOOD</span>
            </div>
            <p className="text-blue-100/60 max-w-sm mb-8">
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
            <ul className="space-y-4 text-blue-100/60">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <span>{BRAND.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <a href={BRAND.phone} className="hover:text-white transition-colors">{BRAND.displayPhone}</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <a href={`mailto:${BRAND.email}`} className="hover:text-white transition-colors">{BRAND.email}</a>
              </li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-lg font-bold uppercase tracking-widest">Hours</h4>
            <ul className="space-y-4 text-blue-100/60">
              <li className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <span>Mon - Sat: 11AM - 9PM</span>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-white/20 flex-shrink-0" />
                <span>Sunday: Closed</span>
              </li>
              <li className="mt-4">
                <span className={`${status.open ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'} px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest`}>
                  {status.msg}
                </span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 mt-20 pt-8 border-t border-white/5 text-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} {BRAND.name}. All rights reserved.</p>
        </div>
      </footer>
          </motion.div>
        ) : view === "menu" ? (
          <motion.div
            key="menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <FullMenu 
              onBack={() => setView("home")} 
              orderLink={BRAND.orderLink} 
              onAddToCart={addToCart}
              menuData={fullMenuData}
            />
          </motion.div>
        ) : (
          <motion.div
            key="checkout"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="min-h-screen bg-blue-950 p-4 sm:p-8"
          >
            <div className="max-w-2xl mx-auto">
              <button 
                onClick={() => setView("menu")}
                className="text-blue-400 font-bold uppercase tracking-widest text-sm mb-8 flex items-center gap-2"
              >
                <X className="w-4 h-4" /> Back to Menu
              </button>

              <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 sm:p-12 shadow-2xl">
                <h2 className="font-display text-4xl sm:text-6xl text-white mb-8 uppercase">CHECKOUT</h2>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-blue-200/50 uppercase tracking-widest">Full Name</label>
                    <input 
                      type="text" 
                      value={orderInfo.name}
                      onChange={(e) => setOrderInfo({...orderInfo, name: e.target.value})}
                      placeholder="Your Name"
                      className="w-full bg-white/10 border border-white/20 rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-blue-400 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-blue-200/50 uppercase tracking-widest">Phone Number</label>
                    <input 
                      type="tel" 
                      value={orderInfo.phone}
                      onChange={(e) => setOrderInfo({...orderInfo, phone: e.target.value})}
                      placeholder="661-XXX-XXXX"
                      className="w-full bg-white/10 border border-white/20 rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-blue-400 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <label className="text-xs font-bold text-blue-200/50 uppercase tracking-widest">Email Address</label>
                      <span className="text-[10px] font-black uppercase tracking-widest text-emerald-300">10% Off Next Order</span>
                    </div>
                    <input 
                      type="email"
                      value={orderInfo.email}
                      onChange={(e) => setOrderInfo({...orderInfo, email: e.target.value})}
                      placeholder="Optional, but worth it"
                      className="w-full bg-white/10 border border-emerald-400/30 rounded-2xl px-6 py-4 text-white placeholder:text-white/35 focus:ring-2 focus:ring-emerald-400 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-blue-200/50 uppercase tracking-widest">Pickup Time</label>
                    <select 
                      value={orderInfo.time}
                      onChange={(e) => setOrderInfo({...orderInfo, time: e.target.value})}
                      className="w-full bg-white/10 border border-white/20 rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-blue-400 outline-none transition-all appearance-none"
                    >
                      <option value="" className="bg-blue-950">Select Time</option>
                      <option value="ASAP" className="bg-blue-950">ASAP (15-20 mins)</option>
                      <option value="30mins" className="bg-blue-950">In 30 Minutes</option>
                      <option value="1hour" className="bg-blue-950">In 1 Hour</option>
                    </select>
                  </div>

                  <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5 space-y-4">
                    <div className="space-y-3">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={orderInfo.smsConsent}
                          onChange={(e) => setOrderInfo({...orderInfo, smsConsent: e.target.checked})}
                          className="mt-1 h-4 w-4 rounded border-white/30 bg-white/10 text-emerald-400 focus:ring-emerald-400"
                        />
                        <span className="text-sm text-blue-100/80">
                          I agree to receive order updates and promotional texts. Msg & data rates may apply. Reply STOP to opt out.
                        </span>
                      </label>
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={orderInfo.emailConsent}
                          onChange={(e) => setOrderInfo({...orderInfo, emailConsent: e.target.checked})}
                          className="mt-1 h-4 w-4 rounded border-white/30 bg-white/10 text-emerald-400 focus:ring-emerald-400"
                        />
                        <span className="text-sm text-blue-100/80">
                          Send me deals and updates by email.
                        </span>
                      </label>
                    </div>
                    <p className="text-[10px] uppercase tracking-widest text-blue-200/40">
                      Consent version: {CONSENT_TEXT_VERSION}
                    </p>
                  </div>

                  <div className="pt-8 border-t border-white/10">
                    <div className="flex justify-between text-2xl font-display text-white uppercase mb-6">
                      <span>Total Due</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    <button 
                      onClick={handlePlaceOrder}
                      disabled={isPlacingOrder}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-6 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-emerald-600/20 transition-all active:scale-95 flex items-center justify-center gap-3"
                    >
                      <CheckCircle2 className="w-6 h-6" />
                      {isPlacingOrder ? "Placing Order..." : "Place Pickup Order"}
                    </button>
                    <p className="text-center mt-4 text-xs text-blue-200/40 uppercase tracking-widest">
                      Payment will be collected at pickup.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MOBILE STICKY ACTION BAR */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-sm">
        <div className="bg-blue-950/90 backdrop-blur-xl border border-white/20 rounded-3xl p-2 shadow-2xl flex items-center gap-2">
          <a 
            href={BRAND.phone}
            className="flex-1 bg-white/10 hover:bg-white/20 text-white py-4 rounded-2xl flex items-center justify-center gap-2 font-bold uppercase tracking-widest text-xs transition-all"
          >
            <Phone className="w-4 h-4 text-blue-400" /> Call
          </a>
          <button 
            onClick={() => setView("menu")}
            className="flex-[2] bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl flex items-center justify-center gap-2 font-black uppercase tracking-widest text-xs shadow-lg shadow-red-600/20 transition-all active:scale-95"
          >
            <ShoppingCart className="w-4 h-4" /> Order Now
          </button>
        </div>
      </div>

      {/* SUCCESS MODAL */}
      <AnimatePresence>
        {showSuccessModal && lastOrder && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-blue-950/90 backdrop-blur-2xl"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              className="relative bg-blue-900 border border-white/20 rounded-[3rem] p-8 sm:p-12 max-w-xl w-full text-center shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* Decorative Bubbles */}
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
              
              {/* Floating Bubbles */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    y: [-20, -100],
                    x: [0, (i % 2 === 0 ? 20 : -20)],
                    opacity: [0, 0.4, 0]
                  }}
                  transition={{ 
                    duration: 4 + Math.random() * 4,
                    repeat: Infinity,
                    delay: i * 0.8
                  }}
                  className="absolute bg-white/20 rounded-full blur-[1px]"
                  style={{ 
                    width: `${10 + Math.random() * 20}px`,
                    height: `${10 + Math.random() * 20}px`,
                    left: `${10 + Math.random() * 80}%`,
                    bottom: '-20px'
                  }}
                />
              ))}

              <div className="relative z-10 flex-grow overflow-y-auto pr-2 custom-scrollbar">
                <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-8 border-2 border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400" />
                </div>
                
                <h2 className="font-display text-4xl sm:text-5xl text-white mb-4 uppercase leading-tight tracking-tight">
                  CATCH CONFIRMED!
                </h2>
                
                <p className="text-blue-100/70 text-lg mb-8">
                  Thanks, <span className="text-white font-bold">{lastOrder.name}</span>! Your order is being prepared. We'll see you in <span className="text-emerald-400 font-bold">{lastOrder.time === 'ASAP' ? '15-20 minutes' : lastOrder.time === '30mins' ? '30 minutes' : '1 hour'}</span>.
                </p>

                <div className="bg-white/5 rounded-3xl p-5 mb-8 border border-white/10 text-left">
                  <h3 className="text-xs font-bold text-blue-200/50 uppercase tracking-widest mb-3">Customer Capture</h3>
                  <div className="space-y-2 text-sm text-blue-100/75">
                    <p><span className="font-bold text-white">Phone:</span> {lastOrder.phone}</p>
                    {lastOrder.email && <p><span className="font-bold text-white">Email:</span> {lastOrder.email}</p>}
                    <p><span className="font-bold text-white">SMS:</span> {lastOrder.smsConsent ? "Opted in" : "Transactional only"}</p>
                    <p><span className="font-bold text-white">Email:</span> {lastOrder.emailConsent ? "Opted in" : "Not subscribed"}</p>
                  </div>
                </div>

                <div className="bg-white/5 rounded-3xl p-6 mb-8 border border-white/10 text-left">
                  <h3 className="text-xs font-bold text-blue-200/50 uppercase tracking-widest mb-4">Automation Queue</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-blue-100/80">SMS: Order received</span>
                      <span className={`font-bold ${lastOrder.automation.orderReceivedSmsQueued ? "text-emerald-400" : "text-blue-200/40"}`}>
                        {lastOrder.automation.orderReceivedSmsQueued ? "Queued" : "Consent needed"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-blue-100/80">SMS: Ready for pickup</span>
                      <span className={`font-bold ${lastOrder.automation.readySmsEligible ? "text-emerald-400" : "text-blue-200/40"}`}>
                        {lastOrder.automation.readySmsEligible ? "Eligible" : "Consent needed"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-blue-100/80">Later promo follow-up</span>
                      <span className={`font-bold ${lastOrder.automation.promoSmsEligible ? "text-amber-300" : "text-blue-200/40"}`}>
                        {lastOrder.automation.promoSmsEligible ? "Ready for campaign" : "Consent needed"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* ORDER SUMMARY */}
                <div className="bg-white/5 rounded-3xl p-6 mb-8 border border-white/10 text-left">
                  <h3 className="text-xs font-bold text-blue-200/50 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4" /> Order Summary
                  </h3>
                  <div className="space-y-3 mb-6">
                    {lastOrder.items.map((item, i) => (
                      <div key={i} className="flex justify-between items-center text-sm">
                        <span className="text-blue-100/80">
                          <span className="font-bold text-white">{item.quantity}x</span> {item.name}
                        </span>
                        <span className="text-white font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                    <span className="text-white font-bold uppercase tracking-widest text-sm">Total</span>
                    <span className="text-2xl font-black text-emerald-400">${lastOrder.total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="bg-white/5 rounded-3xl p-6 mb-8 border border-white/10 text-left">
                  <div className="flex items-center gap-3 mb-2">
                    <MapPin className="w-4 h-4 text-blue-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-widest">Pickup Location</span>
                  </div>
                  <p className="text-sm text-blue-100/60 ml-7">{BRAND.address}</p>
                </div>

                <button 
                  onClick={() => {
                    setShowSuccessModal(false);
                    setView("home");
                  }}
                  className="w-full bg-white text-blue-950 py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl transition-all active:scale-95 hover:bg-blue-50"
                >
                  Back to Home
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
