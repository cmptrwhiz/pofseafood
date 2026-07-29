import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@/components/menu-board/menu-board-three.css";

export const metadata: Metadata = {
  title: "POF TV 2 | Sides, Drinks & Desserts",
  description: "Additional sides, drinks, and desserts board for the second in-store Fire TV display.",
};

export default function TvTwoLayout({ children }: { children: ReactNode }) {
  return children;
}
