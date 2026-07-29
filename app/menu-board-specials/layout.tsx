import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@/components/menu-board/menu-board-specials.css";

export const metadata: Metadata = {
  title: "Plenty of Fish Seafood | Specials Menu Board",
  description: "Digital specials board for Monday Madness, lunch specials, and upcoming gumbo weekends.",
};

export default function MenuBoardSpecialsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
