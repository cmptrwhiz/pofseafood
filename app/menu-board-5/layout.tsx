import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@/components/menu-board/menu-board-four.css";

export const metadata: Metadata = {
  title: "Menu Board 5 | Plenty of Fish Seafood",
  description: "Best sellers and fast pickup menu board for Plenty of Fish Seafood.",
};

export default function MenuBoardFiveLayout({ children }: { children: ReactNode }) {
  return children;
}
