import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@/components/display/display.css";
import "@/components/menu-board/menu-board-one.css";
import "@/components/menu-board/menu-board-two.css";

export const metadata: Metadata = {
  title: "POF TV 1 | Rotating Menu Board",
  description: "Rotating menu board for the first in-store Fire TV display.",
};

export default function TvOneLayout({ children }: { children: ReactNode }) {
  return children;
}
