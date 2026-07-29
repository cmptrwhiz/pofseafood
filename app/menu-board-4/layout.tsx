import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@/components/menu-board/menu-board-four.css";

export const metadata: Metadata = {
  title: "Plenty of Fish Seafood | Menu Board 4",
  description: "Lunch, dinner, and fish market digital menu board for Plenty of Fish Seafood.",
};

export default function MenuBoardFourLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
