import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import {
  FALLBACK_FEATURED_MENU_ITEMS,
  FALLBACK_FULL_MENU,
  MONDAY_MADNESS_CATEGORY,
  type DisplayMenuCategory,
  isDisplayableMenuItem,
  isFeaturedMenuItemCandidate,
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

const FEATURED_NAME_PRIORITY = [
  /shrimp basket/i,
  /fish\s*&\s*chips|fish and chips/i,
  /seafood combo|fish\s*&\s*shrimp combo|captain'?s platter|family feast/i,
  /catfish filet|catish filet/i,
  /tilapia filet/i,
  /red snapper/i,
  /salmon/i,
  /oysters?/i,
  /jumbo shrimp/i,
];

function pickFeaturedItems(
  entries: Array<{
    categoryTitle: string;
    item: {
      name: string;
      description: string | null;
      priceCents: number;
      imageUrl: string | null;
    };
  }>
) {
  const featured: typeof entries = [];
  const usedNames = new Set<string>();

  for (const pattern of FEATURED_NAME_PRIORITY) {
    const match = entries.find(({ item, categoryTitle }) => {
      const key = item.name.trim().toLowerCase();
      return (
        !usedNames.has(key) &&
        isFeaturedMenuItemCandidate(item, categoryTitle) &&
        pattern.test(item.name)
      );
    });

    if (!match) {
      continue;
    }

    usedNames.add(match.item.name.trim().toLowerCase());
    featured.push(match);

    if (featured.length === 3) {
      return featured;
    }
  }

  for (const entry of entries) {
    const key = entry.item.name.trim().toLowerCase();
    if (usedNames.has(key)) {
      continue;
    }

    if (!isFeaturedMenuItemCandidate(entry.item, entry.categoryTitle)) {
      continue;
    }

    usedNames.add(key);
    featured.push(entry);

    if (featured.length === 3) {
      break;
    }
  }

  return featured;
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

    const categorySections = merchantConnection.menuCategories
      .map((category: MerchantMenuCategory) => {
        const items = dedupeByName(
          category.menuItems.filter(isDisplayableMenuItem)
        );

        return {
          title: category.name,
          rawItems: items,
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

    const featuredCatalog = [
      ...categorySections.flatMap((category: {
        title: string;
        rawItems: MerchantMenuItem[];
      }) =>
        category.rawItems.map((item: MerchantMenuItem) => ({
          categoryTitle: category.title,
          item,
        }))
      ),
      ...uncategorizedItems.map((item: MerchantMenuItem) => ({
        categoryTitle: "Fresh Picks",
        item,
      })),
    ];

    const featuredSourceItems = pickFeaturedItems(featuredCatalog);

    const featuredItems = (
      featuredSourceItems.length > 0
        ? featuredSourceItems.map(({ item }) => item)
        : dedupeByName([
            ...categorySections.flatMap((category: {
              rawItems: MerchantMenuItem[];
            }) => category.rawItems),
            ...uncategorizedItems,
          ])
    ).map(toDisplayMenuItem);

    const paddedFeaturedItems = [
      ...featuredItems,
      ...FALLBACK_FEATURED_MENU_ITEMS.filter(
        (fallback) => !featuredItems.some((item) => item.name === fallback.name)
      ),
    ].slice(0, 3);
    const fullMenu: DisplayMenuCategory[] = categorySections.map((category: {
      title: string;
      items: ReturnType<typeof toDisplayMenuItem>[];
    }) => ({
      title: category.title,
      items: category.items,
    }));

    if (uncategorizedItems.length > 0) {
      fullMenu.unshift({
        title: "Fresh Picks",
        items: uncategorizedItems.map(toDisplayMenuItem),
      });
    }

    fullMenu.unshift(MONDAY_MADNESS_CATEGORY);

    return NextResponse.json({
      source: "clover",
      featuredItems: paddedFeaturedItems,
      fullMenu: fullMenu.length > 0 ? fullMenu : FALLBACK_FULL_MENU,
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
