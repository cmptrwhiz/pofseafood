import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@/components/menu-board/menu-board-one.css";

export const metadata: Metadata = {
  title: "Plenty of Fish Seafood | Menu Board",
  description: "Digital menu board for Plenty of Fish Seafood.",
};

export default function MenuBoardLayout({ children }: { children: ReactNode }) {
  return children;
}
