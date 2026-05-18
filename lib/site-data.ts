export const BRAND = {
  name: "Plenty of Fish Seafood",
  orderLink: "https://orderplentyoffishseafood.com/order",
  phoneHref: "tel:+16614719620",
  displayPhone: "661.471.9620",
  address: "43937 15th Street West, Lancaster, CA 93534",
  email: "info@orderplentyoffishseafood.com",
  mapLink:
    "https://www.google.com/maps/search/?api=1&query=43937+15th+Street+West+Lancaster+CA+93534",
  logoSrc: "/logo.png",
} as const;

export const HOURS = [
  { label: "Monday", value: "11:00 AM - 9:00 PM" },
  { label: "Tuesday", value: "11:00 AM - 9:00 PM" },
  { label: "Wednesday", value: "11:00 AM - 9:00 PM" },
  { label: "Thursday", value: "11:00 AM - 9:00 PM" },
  { label: "Friday", value: "11:00 AM - 9:00 PM" },
  { label: "Saturday", value: "11:00 AM - 9:00 PM" },
  { label: "Sunday", value: "Closed" },
] as const;

export const ABOUT_POINTS = [
  "Direct ordering that helps customers skip inflated third-party app markups.",
  "Fresh fried seafood, combos, baskets, and rotating local specials built for repeat orders.",
  "A Lancaster location that can support branded search, local SEO, and Google Business visibility.",
] as const;

export const REVIEW_QUOTES = [
  "Best fried catfish in the AV. The breading is light and seasoned right.",
  "The family combos feed everybody without the app-fee sting.",
  "Ordering direct was easy, and pickup was fast.",
] as const;
