export type MenuBoardItem = {
  name: string;
  price: string;
};

export type MenuBoardOneColumn = {
  heading: string;
  accent: "gold" | "red" | "blue" | string;
  items: MenuBoardItem[];
  callout?: string;
};

export type MenuBoardOneSlide = {
  title: string;
  columns: MenuBoardOneColumn[];
};

export type MenuBoardOneData = {
  updatedLabel: string;
  heroPrice?: string;
  promos: string[];
  slides: MenuBoardOneSlide[];
};

export type MenuBoardTwoColumn = {
  title: string;
  items: MenuBoardItem[];
};

export type MenuBoardTwoSection = {
  title: string;
  subtitle?: string;
  items?: MenuBoardItem[];
  columns?: MenuBoardTwoColumn[];
};

export type MenuBoardTwoData = {
  business: {
    name: string;
    city: string;
    address: string;
    phone: string;
    cta: string;
  };
  promo: {
    text: string;
    active: boolean;
  };
  featured?: Array<{
    label: string;
    name: string;
    price: string;
    description: string;
    note: string;
  }>;
  ticker?: string[];
  sections: MenuBoardTwoSection[];
  lastSync: string;
};
