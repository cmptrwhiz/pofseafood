export type DisplayMenuItem = {
  name: string;
  desc: string;
  price: string;
  img?: string;
  badge?: string;
};

export type DisplayMenuCategory = {
  title: string;
  items: DisplayMenuItem[];
};

const MENU_UTILITY_NAME_PATTERN =
  /(gift\s*card|delivery\s*fee|service\s*fee|tip\b)/i;
const FEATURED_CATEGORY_EXCLUDE_PATTERN =
  /(drinks|desserts|side orders|additional side orders)/i;
const FEATURED_NAME_INCLUDE_PATTERN =
  /(shrimp|fish|catfish|snapper|salmon|tilapia|cod|whiting|oyster|combo|platter|rice|taco|lobster|buffalo|filet|fillet|nuggets?)/i;

export const FALLBACK_FEATURED_MENU_ITEMS: DisplayMenuItem[] = [
  {
    name: "Shrimp Basket",
    desc: "Crispy shrimp, fries, house sauce",
    price: "$15.99",
    img: "/images/shrimp.png",
  },
  {
    name: "Fish & Chips",
    desc: "Golden fried fish, seasoned fries",
    price: "$14.99",
    img: "/images/fish.png",
  },
  {
    name: "Seafood Combo",
    desc: "Best value combo (Save $5)",
    price: "$19.99",
    img: "/images/combo.png",
    badge: "Best Value",
  },
];

export const FALLBACK_FULL_MENU: DisplayMenuCategory[] = [
  {
    title: "Fish Baskets",
    items: [
      { name: "Catfish Basket (2pc)", desc: "Crispy catfish fillets with fries, coleslaw, and bread", price: "$14.99" },
      { name: "Catfish Basket (3pc)", desc: "Crispy catfish fillets with fries, coleslaw, and bread", price: "$17.99" },
      { name: "Red Snapper Basket (2pc)", desc: "Golden fried snapper with fries, coleslaw, and bread", price: "$15.99" },
      { name: "Red Snapper Basket (3pc)", desc: "Golden fried snapper with fries, coleslaw, and bread", price: "$18.99" },
      { name: "Tilapia Basket (2pc)", desc: "Fried tilapia fillets with fries, coleslaw, and bread", price: "$13.99" },
      { name: "Cod Basket (3pc)", desc: "Classic fish & chips style cod with fries and slaw", price: "$16.99" },
    ],
  },
  {
    title: "Shrimp Baskets",
    items: [
      { name: "Jumbo Shrimp (6pc)", desc: "Large crispy shrimp with fries and house sauce", price: "$15.99" },
      { name: "Jumbo Shrimp (10pc)", desc: "Large crispy shrimp with fries and house sauce", price: "$21.99" },
      { name: "Popcorn Shrimp Basket", desc: "Bite-sized crispy shrimp with fries", price: "$12.99" },
    ],
  },
  {
    title: "Seafood Combos",
    items: [
      { name: "Fish & Shrimp Combo", desc: "2pc Fish (Catfish or Snapper) & 4pc Jumbo Shrimp", price: "$22.99", badge: "Popular" },
      { name: "The Captain's Platter", desc: "2pc Fish, 4pc Shrimp, 2pc Oysters, and Clam Strips", price: "$28.99", badge: "Best Value" },
      { name: "Family Feast", desc: "8pc Fish, 12pc Shrimp, Large Fries, Large Slaw", price: "$54.99" },
    ],
  },
  {
    title: "Sandwiches & More",
    items: [
      { name: "Fish Sandwich", desc: "Fried fillet on a toasted bun with lettuce, tomato, and tartar", price: "$10.99" },
      { name: "Shrimp Po' Boy", desc: "Crispy shrimp on a French roll with remoulade sauce", price: "$13.99" },
      { name: "Oyster Basket (6pc)", desc: "Freshly shucked and fried oysters with fries", price: "$18.99" },
    ],
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
    ],
  },
  {
    title: "Drinks",
    items: [
      { name: "Soft Drinks", desc: "Coke, Diet Coke, Sprite, Dr. Pepper", price: "$2.50" },
      { name: "Sweet Tea", desc: "Southern style house-brewed", price: "$2.99" },
      { name: "Lemonade", desc: "Freshly squeezed", price: "$3.50" },
      { name: "Bottled Water", desc: "Purified water", price: "$1.50" },
    ],
  },
];

export const MONDAY_MADNESS_CATEGORY: DisplayMenuCategory = {
  title: "Monday Madness",
  items: [
    {
      name: "50% Off All Lunches",
      desc: "Every Monday from 11:00 AM to 2:00 PM at our Lancaster location.",
      price: "Half Off",
      img: "/images/fish.png",
      badge: "Mondays 11-2",
    },
    {
      name: "Jumbo Shrimp Deals",
      desc: "Discounted jumbo shrimp plates and lunch combinations while the special is running.",
      price: "Monday Deal",
      img: "/images/shrimp.png",
    },
    {
      name: "Handfilled Nuggets",
      desc: "Often featured as a $10 Monday special with catfish, snapper, or salmon.",
      price: "$10 Special",
      img: "/images/combo.png",
    },
  ],
};

const ITEM_IMAGE_RULES: Array<{ match: RegExp; img: string; badge?: string }> = [
  { match: /shrimp/i, img: "/images/shrimp.png" },
  { match: /(oyster|lobster|crab)/i, img: "/images/combo.png" },
  { match: /(taco|nuggets?)/i, img: "/images/shrimp.png" },
  { match: /(fish|catfish|cod|tilapia|snapper)/i, img: "/images/fish.png" },
  { match: /(salmon|whiting|basa|filet|fillet)/i, img: "/images/fish.png" },
  { match: /(combo|platter|family feast)/i, img: "/images/combo.png", badge: "Best Value" },
  { match: /sandwich|po' boy/i, img: "/sandwich.png" },
];

function inferMenuArt(name: string) {
  return ITEM_IMAGE_RULES.find((rule) => rule.match.test(name));
}

function hasUsefulDescription(description: string | null) {
  if (!description) {
    return false;
  }

  const normalized = description.trim();
  if (!normalized) {
    return false;
  }

  if (/^(fixed|variable)$/i.test(normalized)) {
    return false;
  }

  if (/^\$?\d+(\.\d+)?$/.test(normalized)) {
    return false;
  }

  return true;
}

export function isDisplayableMenuItem(item: {
  name: string;
  priceCents: number;
}) {
  return (
    !!item.name.trim() &&
    item.priceCents > 0 &&
    !MENU_UTILITY_NAME_PATTERN.test(item.name)
  );
}

export function isFeaturedMenuItemCandidate(
  item: {
    name: string;
    priceCents: number;
  },
  categoryTitle?: string | null
) {
  if (!isDisplayableMenuItem(item)) {
    return false;
  }

  if (FEATURED_CATEGORY_EXCLUDE_PATTERN.test(categoryTitle || "")) {
    return false;
  }

  if (item.priceCents < 199 || item.priceCents > 10000) {
    return false;
  }

  return FEATURED_NAME_INCLUDE_PATTERN.test(item.name);
}

export function centsToPrice(priceCents: number) {
  return `$${(priceCents / 100).toFixed(2)}`;
}

export function toDisplayMenuItem(item: {
  name: string;
  description: string | null;
  priceCents: number;
  imageUrl: string | null;
}) {
  const inferred = inferMenuArt(item.name);

  return {
    name: item.name,
    desc: hasUsefulDescription(item.description)
      ? item.description!.trim()
      : "Fresh seafood made to order.",
    price: centsToPrice(item.priceCents),
    img: item.imageUrl || inferred?.img || "/images/combo.png",
    badge: inferred?.badge,
  };
}
