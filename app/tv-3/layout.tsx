import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@/components/menu-board/menu-board-specials.css";

export const metadata: Metadata = {
  title: "POF TV 3 | Special Days",
  description: "Special days board for the third in-store Fire TV display.",
};

export default function TvThreeLayout({ children }: { children: ReactNode }) {
  return children;
}
