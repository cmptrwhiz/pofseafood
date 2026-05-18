import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import {
  FALLBACK_FEATURED_MENU_ITEMS,
  FALLBACK_FULL_MENU,
  MONDAY_MADNESS_CATEGORY,
  TACO_TUESDAY_CATEGORY,
  bucketUncategorizedItem,
  normalizeCategoryTitle,
  sortDisplayCategories,
  type DisplayMenuCategory,
  isDisplayableMenuItem,
  toDisplayMenuItem,
} from "@/lib/menu";

type MerchantMenuPayload = Prisma.MerchantConnectionGetPayload<{
  include: {
    menuCategories: {
      include: {
        menuItems: true;
      };
    };
    menuItems: true;
  };
}>;

type MerchantMenuCategory = MerchantMenuPayload["menuCategories"][number];
type MerchantMenuItem = MerchantMenuPayload["menuItems"][number];

function dedupeByName<T extends { name: string }>(items: T[]) {
  const seen = new Set<string>();

  return items.filter((item) => {
    const key = item.name.trim().toLowerCase();
    if (!key || seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

export async function GET() {
  try {
    const merchantConnection = await prisma.merchantConnection.findFirst({
      orderBy: [{ lastSyncAt: "desc" }, { createdAt: "desc" }],
      include: {
        menuCategories: {
          where: {
            isActive: true,
          },
          orderBy: {
            sortOrder: "asc",
          },
          include: {
            menuItems: {
              where: {
                isHidden: false,
              },
              orderBy: {
                createdAt: "asc",
              },
            },
          },
        },
        menuItems: {
          where: {
            isHidden: false,
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    const hasNormalizedMenu =
      !!merchantConnection &&
      (merchantConnection.menuCategories.length > 0 ||
        merchantConnection.menuItems.length > 0);

    if (!hasNormalizedMenu || !merchantConnection) {
      return NextResponse.json({
        source: "fallback",
        featuredItems: FALLBACK_FEATURED_MENU_ITEMS,
        fullMenu: FALLBACK_FULL_MENU,
      });
    }

    const groupedCategories = new Map<string, MerchantMenuItem[]>();

    for (const category of merchantConnection.menuCategories) {
      const normalizedTitle = normalizeCategoryTitle(category.name);
      const existingItems = groupedCategories.get(normalizedTitle) || [];
      existingItems.push(...category.menuItems.filter(isDisplayableMenuItem));
      groupedCategories.set(normalizedTitle, existingItems);
    }

    const categorySections = [...groupedCategories.entries()]
      .map(([title, rawItems]) => {
        const items = dedupeByName(rawItems);

        return {
          title,
          items: items.map(toDisplayMenuItem),
        };
      })
      .filter((category: { items: unknown[] }) => category.items.length > 0);

    const uncategorizedItems = dedupeByName(
      merchantConnection.menuItems.filter(
        (item: MerchantMenuItem) =>
          item.menuCategoryId === null && isDisplayableMenuItem(item)
      )
    );

    const fullMenu: DisplayMenuCategory[] = categorySections.map((category: {
      title: string;
      items: ReturnType<typeof toDisplayMenuItem>[];
    }) => ({
      title: category.title,
      items: category.items,
    }));

    if (uncategorizedItems.length > 0) {
      const uncategorizedBuckets = new Map<string, ReturnType<typeof toDisplayMenuItem>[]>();

      for (const item of uncategorizedItems) {
        const bucket = bucketUncategorizedItem(item.name);
        const bucketItems = uncategorizedBuckets.get(bucket) || [];
        bucketItems.push(toDisplayMenuItem(item));
        uncategorizedBuckets.set(bucket, bucketItems);
      }

      for (const [title, items] of uncategorizedBuckets.entries()) {
        fullMenu.push({
          title,
          items,
        });
      }
    }

    const hasTacoTuesdayCategory = fullMenu.some(
      (category) => category.title === "Taco Tuesdays"
    );

    fullMenu.unshift(MONDAY_MADNESS_CATEGORY);

    if (!hasTacoTuesdayCategory) {
      fullMenu.unshift(TACO_TUESDAY_CATEGORY);
    }

    const orderedMenu = sortDisplayCategories(fullMenu);

    return NextResponse.json({
      source: "clover",
      featuredItems: FALLBACK_FEATURED_MENU_ITEMS,
      fullMenu: orderedMenu.length > 0 ? orderedMenu : FALLBACK_FULL_MENU,
    });
  } catch (error) {
    console.error("menu-route-failed", error);
    return NextResponse.json(
      {
        error: "Menu load failed.",
        source: "fallback",
        featuredItems: FALLBACK_FEATURED_MENU_ITEMS,
        fullMenu: FALLBACK_FULL_MENU,
      },
      { status: 500 }
    );
  }
}
