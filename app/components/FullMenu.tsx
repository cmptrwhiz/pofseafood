import React from "react";
import { motion } from "motion/react";
import { ArrowLeft, ShoppingCart, Info } from "lucide-react";
import { FALLBACK_FULL_MENU, type DisplayMenuCategory, type DisplayMenuItem } from "@/lib/menu";

interface FullMenuProps {
  onBack: () => void;
  orderLink: string;
  onAddToCart: (item: DisplayMenuItem) => void;
  menuData?: DisplayMenuCategory[];
}

export default function FullMenu({
  onBack,
  orderLink,
  onAddToCart,
  menuData = FALLBACK_FULL_MENU,
}: FullMenuProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-screen bg-[#001233] text-white pb-20"
    >
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#001233]/90 backdrop-blur-md border-b border-white/10 px-4 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-blue-300 hover:text-white transition-colors font-bold uppercase tracking-widest text-sm"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <h1 className="font-display text-2xl sm:text-3xl tracking-tight">OUR MENU</h1>
          <button 
            onClick={() => window.open(orderLink, '_blank')}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all"
          >
            Order
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 pt-8">
        {/* Notice */}
        <div className="bg-emerald-950/40 border border-emerald-500/20 rounded-2xl p-4 mb-12 flex items-start gap-3">
          <Info className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-emerald-100/80">
            <span className="font-bold text-emerald-400">Pro Tip:</span> Prices shown are for direct orders. Third-party apps like DoorDash charge $3-$5 more per item. Pay cash in-store to save even more on card fees!
          </p>
        </div>

        {/* Menu Sections */}
        <div className="space-y-16">
          {menuData.map((category, idx) => (
            <section key={idx}>
              <h2 className="font-display text-3xl sm:text-5xl mb-8 border-b border-white/10 pb-4 text-blue-400 uppercase tracking-tight">
                {category.title}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                {category.items.map((item, i) => (
                  <div key={i} className="group relative flex justify-between items-start border-b border-white/5 pb-4 hover:border-blue-500/30 transition-colors">
                    <div className="pr-4">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors">{item.name}</h3>
                        {item.badge && (
                          <span className="bg-red-600 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-blue-100/60 leading-relaxed">{item.desc}</p>
                    </div>
                    <div className="text-right flex flex-col items-end gap-2">
                      <span className="text-xl font-black text-blue-400">{item.price}</span>
                      <button 
                        onClick={() => onAddToCart(item)}
                        className="p-2 bg-white/5 hover:bg-blue-600 rounded-lg transition-all active:scale-95"
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-24 text-center border-t border-white/10 pt-12">
          <p className="text-blue-100/40 text-sm italic mb-8">
            * Consuming raw or undercooked meats, poultry, seafood, shellfish, or eggs may increase your risk of foodborne illness.
          </p>
          <button 
            onClick={() => window.open(orderLink, '_blank')}
            className="bg-red-600 hover:bg-red-700 text-white px-12 py-6 rounded-2xl text-2xl font-black uppercase tracking-widest shadow-2xl shadow-red-600/40 transition-all active:scale-95"
          >
            Start Your Order
          </button>
        </div>
      </div>
    </motion.div>
  );
}
