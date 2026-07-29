import { DisplayPlayer, type DisplayPlaylist } from "@/components/display/DisplayPlayer";

const tvOnePlaylist: DisplayPlaylist = {
  updatedLabel: "TV 1 menu rotation",
  items: [
    {
      id: "menu-board",
      title: "Core Menu",
      type: "menu-board-one",
      durationSeconds: 180,
    },
    {
      id: "menu-board-2",
      title: "Full Menu",
      type: "menu-board-two",
      durationSeconds: 180,
    },
    {
      id: "lunch-favorites",
      title: "Lunch Favorites",
      type: "spotlight",
      durationSeconds: 180,
      kicker: "Fast Pickup",
      headline: "Lunch Favorites",
      subheadline: "Hot seafood plates built for the lunch rush. Order direct, skip the apps.",
      image: "/menu-board/combo-platter.png",
      items: [
        { name: "Catfish Filet Lunch", price: "$15.98" },
        { name: "Tilapia Filet Lunch", price: "$13.42" },
        { name: "Shrimp Over Rice", price: "$14.75" },
        { name: "Red Snapper Lunch", price: "$15.70" }
      ],
    },
    {
      id: "family-combo-push",
      title: "Family Combo Push",
      type: "spotlight",
      durationSeconds: 180,
      kicker: "Feed The Crew",
      headline: "Combo Up",
      subheadline: "Add sides, drinks, and desserts before pickup. Bigger baskets, better value.",
      image: "/menu-board/family-platter.jpg",
      items: [
        { name: "Fish & Shrimp", price: "$27.95" },
        { name: "Fish, Shrimp & Oysters", price: "$27.95" },
        { name: "16pc Fish Family Meal", price: "$59.99" },
        { name: "Mini Family Meal", price: "$49.99" }
      ],
    },
  ],
};

export default function TvOnePage() {
  return <DisplayPlayer playlist={tvOnePlaylist} />;
}
