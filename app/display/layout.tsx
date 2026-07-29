import type { Metadata } from "next";
import "@/components/display/display.css";
import "@/components/menu-board/menu-board-one.css";
import "@/components/menu-board/menu-board-two.css";
import "@/components/menu-board/menu-board-four.css";

export const metadata: Metadata = {
  title: "POF Display Redirect | Plenty of Fish Seafood",
  description: "Redirects legacy display screens to the TV 1 menu board rotation.",
};

export default function DisplayLayout({ children }: { children: React.ReactNode }) {
  return children;
}
