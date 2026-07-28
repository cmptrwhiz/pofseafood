import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@/components/menu-board/menu-board-two.css";

export const metadata: Metadata = {
  title: "Plenty of Fish Seafood | Menu Board 2",
  description: "Second digital menu board for Plenty of Fish Seafood.",
};

export default function MenuBoardTwoLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
