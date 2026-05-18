"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import FullMenu from "@/app/components/FullMenu";
import {
  FALLBACK_FULL_MENU,
  type DisplayMenuCategory,
  type DisplayMenuItem,
} from "@/lib/menu";
import { BRAND } from "@/lib/site-data";

export default function MenuPage() {
  const router = useRouter();
  const [menuData, setMenuData] = useState<DisplayMenuCategory[]>(
    FALLBACK_FULL_MENU
  );

  useEffect(() => {
    let isActive = true;

    const loadMenu = async () => {
      try {
        const response = await fetch("/api/menu", { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Menu request failed");
        }

        const data = (await response.json()) as {
          fullMenu?: DisplayMenuCategory[];
        };

        if (isActive && Array.isArray(data.fullMenu) && data.fullMenu.length > 0) {
          setMenuData(data.fullMenu);
        }
      } catch (error) {
        console.error("menu-route-load-failed", error);
      }
    };

    loadMenu();

    return () => {
      isActive = false;
    };
  }, []);

  const handleAddToCart = (item: DisplayMenuItem) => {
    window.open(BRAND.orderLink, "_blank");
  };

  return (
    <FullMenu
      onBack={() => router.push("/")}
      orderLink={BRAND.orderLink}
      onAddToCart={handleAddToCart}
      menuData={menuData}
    />
  );
}
