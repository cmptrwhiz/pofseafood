import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { fetchCloverMenuSnapshot } from "@/lib/clover";
import { prisma } from "@/lib/db";

type CloverCollection<T> = {
  elements?: T[];
};

type CloverCategory = {
  id?: string;
  name?: string;
};

type CloverItemCategoryRef = {
  id?: string;
};

type CloverItem = {
  id?: string;
  name?: string;
  price?: number;
  defaultPrice?: number;
  description?: string;
  sku?: string;
  hidden?: boolean;
  available?: boolean;
  categories?: CloverCollection<CloverItemCategoryRef>;
  itemCategories?: CloverCollection<CloverItemCategoryRef>;
};

function getCategoryRefs(item: CloverItem) {
  const categories = item.categories?.elements;
  const itemCategories = item.itemCategories?.elements;
  return categories?.length ? categories : itemCategories || [];
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as {
      merchantId?: string;
    };

    if (!body.merchantId) {
      return NextResponse.json(
        { error: "merchantId is required." },
        { status: 400 }
      );
    }

    const merchantConnection = await prisma.merchantConnection.findUnique({
      where: {
        cloverMerchantId: body.merchantId,
      },
    });

    if (!merchantConnection) {
      return NextResponse.json(
        { error: "Merchant connection not found." },
        { status: 404 }
      );
    }

    const snapshot = await fetchCloverMenuSnapshot(
      merchantConnection.cloverMerchantId,
      merchantConnection.accessToken
    );

    const categoryElements = ((snapshot.categories as CloverCollection<CloverCategory>).elements ||
      []) as CloverCategory[];
    const itemElements = ((snapshot.items as CloverCollection<CloverItem>).elements ||
      []) as CloverItem[];

    const normalizedCategoryIds = new Map<string, string>();

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      for (const [index, category] of categoryElements.entries()) {
        if (!category.id || !category.name) {
          continue;
        }

        const savedCategory = await tx.menuCategory.upsert({
          where: {
            merchantConnectionId_cloverCategoryId: {
              merchantConnectionId: merchantConnection.id,
              cloverCategoryId: category.id,
            },
          },
          create: {
            merchantConnectionId: merchantConnection.id,
            cloverCategoryId: category.id,
            name: category.name,
            sortOrder: index,
            isActive: true,
          },
          update: {
            name: category.name,
            sortOrder: index,
            isActive: true,
          },
        });

        normalizedCategoryIds.set(category.id, savedCategory.id);
      }

      for (const item of itemElements) {
        if (!item.id || !item.name) {
          continue;
        }

        const categoryRef = getCategoryRefs(item)[0];
        const menuCategoryId = categoryRef?.id
          ? normalizedCategoryIds.get(categoryRef.id) || null
          : null;

        await tx.menuItem.upsert({
          where: {
            merchantConnectionId_cloverItemId: {
              merchantConnectionId: merchantConnection.id,
              cloverItemId: item.id,
            },
          },
          create: {
            merchantConnectionId: merchantConnection.id,
            menuCategoryId,
            cloverItemId: item.id,
            name: item.name,
            description: item.description || null,
            priceCents: item.price ?? item.defaultPrice ?? 0,
            isAvailable: item.available ?? true,
            isHidden: item.hidden ?? false,
          },
          update: {
            menuCategoryId,
            name: item.name,
            description: item.description || null,
            priceCents: item.price ?? item.defaultPrice ?? 0,
            isAvailable: item.available ?? true,
            isHidden: item.hidden ?? false,
          },
        });
      }
    });

    await prisma.syncEvent.create({
      data: {
        merchantConnectionId: merchantConnection.id,
        source: "manual",
        eventType: "menu.sync.snapshot",
        payloadJson: snapshot,
        status: "received",
      },
    });

    await prisma.merchantConnection.update({
      where: {
        id: merchantConnection.id,
      },
      data: {
        lastSyncAt: new Date(),
        syncStatus: "menu_normalized",
      },
    });

    return NextResponse.json({
      ok: true,
      merchantId: merchantConnection.cloverMerchantId,
      categoriesFetched: categoryElements.length,
      itemsFetched: itemElements.length,
      note: "Snapshot stored in sync_events and normalized into MenuCategory/MenuItem.",
    });
  } catch (error) {
    console.error("clover-menu-sync-failed", error);
    return NextResponse.json(
      {
        error: "Clover menu sync failed.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
