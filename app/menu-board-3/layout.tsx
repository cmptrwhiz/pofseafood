import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@/components/menu-board/menu-board-three.css";

export const metadata: Metadata = {
  title: "Plenty of Fish Seafood | Menu Board 3",
  description: "Third digital menu board for sides, drinks, and desserts.",
};

export default function MenuBoardThreeLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
