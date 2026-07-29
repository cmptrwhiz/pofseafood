import type { Metadata } from "next";
import "@/components/display/display.css";
import "@/components/menu-board/menu-board-one.css";
import "@/components/menu-board/menu-board-two.css";
import "@/components/menu-board/menu-board-three.css";
import "@/components/menu-board/menu-board-specials.css";

export const metadata: Metadata = {
  title: "Display Manager | Plenty of Fish Seafood",
  description:
    "Rotating Fire TV display playlist for Plenty of Fish Seafood menu boards and promotions.",
};

export default function DisplayLayout({ children }: { children: React.ReactNode }) {
  return children;
}
