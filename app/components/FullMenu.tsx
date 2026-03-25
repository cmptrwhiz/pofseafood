import React from "react";
import { motion } from "motion/react";
import { ArrowLeft, ShoppingCart, Info } from "lucide-react";

interface MenuItem {
  name: string;
  desc: string;
  price: string;
  img?: string;
  badge?: string;
}

interface MenuCategory {
  title: string;
  items: MenuItem[];
}

const MENU_DATA: MenuCategory[] = [
  {
    title: "Fish Baskets",
    items: [
      { name: "Catfish Basket (2pc)", desc: "Crispy catfish fillets with fries, coleslaw, and bread", price: "$14.99" },
      { name: "Catfish Basket (3pc)", desc: "Crispy catfish fillets with fries, coleslaw, and bread", price: "$17.99" },
      { name: "Red Snapper Basket (2pc)", desc: "Golden fried snapper with fries, coleslaw, and bread", price: "$15.99" },
      { name: "Red Snapper Basket (3pc)", desc: "Golden fried snapper with fries, coleslaw, and bread", price: "$18.99" },
      { name: "Tilapia Basket (2pc)", desc: "Fried tilapia fillets with fries, coleslaw, and bread", price: "$13.99" },
      { name: "Cod Basket (3pc)", desc: "Classic fish & chips style cod with fries and slaw", price: "$16.99" },
    ]
  },
  {
    title: "Shrimp Baskets",
    items: [
      { name: "Jumbo Shrimp (6pc)", desc: "Large crispy shrimp with fries and house sauce", price: "$15.99" },
      { name: "Jumbo Shrimp (10pc)", desc: "Large crispy shrimp with fries and house sauce", price: "$21.99" },
      { name: "Popcorn Shrimp Basket", desc: "Bite-sized crispy shrimp with fries", price: "$12.99" },
    ]
  },
  {
    title: "Seafood Combos",
    items: [
      { name: "Fish & Shrimp Combo", desc: "2pc Fish (Catfish or Snapper) & 4pc Jumbo Shrimp", price: "$22.99", badge: "Popular" },
      { name: "The Captain's Platter", desc: "2pc Fish, 4pc Shrimp, 2pc Oysters, and Clam Strips", price: "$28.99", badge: "Best Value" },
      { name: "Family Feast", desc: "8pc Fish, 12pc Shrimp, Large Fries, Large Slaw", price: "$54.99" },
    ]
  },
  {
    title: "Sandwiches & More",
    items: [
      { name: "Fish Sandwich", desc: "Fried fillet on a toasted bun with lettuce, tomato, and tartar", price: "$10.99" },
      { name: "Shrimp Po' Boy", desc: "Crispy shrimp on a French roll with remoulade sauce", price: "$13.99" },
      { name: "Oyster Basket (6pc)", desc: "Freshly shucked and fried oysters with fries", price: "$18.99" },
    ]
  },
  {
    title: "Sides & Add-ons",
    items: [
      { name: "Seasoned Fries", desc: "Crispy and golden", price: "$3.99" },
      { name: "Coleslaw", desc: "House-made creamy slaw", price: "$2.99" },
      { name: "Hush Puppies (6pc)", desc: "Sweet and savory cornmeal fritters", price: "$4.99" },
      { name: "Onion Rings", desc: "Thick-cut and beer-battered", price: "$5.99" },
      { name: "Extra Fish Piece", desc: "Add to any basket", price: "$4.50" },
      { name: "Extra Shrimp (1pc)", desc: "Add to any basket", price: "$2.00" },
    ]
  },
  {
    title: "Drinks",
    items: [
      { name: "Soft Drinks", desc: "Coke, Diet Coke, Sprite, Dr. Pepper", price: "$2.50" },
      { name: "Sweet Tea", desc: "Southern style house-brewed", price: "$2.99" },
      { name: "Lemonade", desc: "Freshly squeezed", price: "$3.50" },
      { name: "Bottled Water", desc: "Purified water", price: "$1.50" },
    ]
  }
];

export default function FullMenu({ onBack, orderLink }: { onBack: () => void; orderLink: string }) {
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
          {MENU_DATA.map((category, idx) => (
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
                        onClick={() => window.open(orderLink, '_blank')}
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
