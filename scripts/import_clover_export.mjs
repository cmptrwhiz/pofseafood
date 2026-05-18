#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const UTILITY_ITEM_PATTERN = /(gift\s*card|delivery\s*fee|service\s*fee|tip\b)/i;

function parseArgs(argv) {
  const args = {
    filePath: "",
    merchantId: "",
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--merchant" || token === "-m") {
      args.merchantId = argv[index + 1] || "";
      index += 1;
      continue;
    }

    if (!args.filePath) {
      args.filePath = token;
    }
  }

  return args;
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

function makeImportedId(prefix, value, index) {
  const normalized = slugify(value || `${prefix}-${index + 1}`);
  return `imported-${prefix}-${normalized || "entry"}-${index + 1}`;
}

function uniqueByNormalizedName(records, getName) {
  const seen = new Set();
  const unique = [];

  for (const record of records) {
    const name = (getName(record) || "").trim();
    if (!name) {
      continue;
    }

    const key = slugify(name);
    if (!key || seen.has(key)) {
      continue;
    }

    seen.add(key);
    unique.push(record);
  }

  return unique;
}

function cleanText(value) {
  return (value || "").trim();
}

function shouldImportMenuItem(item) {
  const name = cleanText(item.name);
  const categoryNames = item.categoryNames || [];

  if (!name) {
    return false;
  }

  if (item.hidden || item.nonRevenue) {
    return false;
  }

  if (UTILITY_ITEM_PATTERN.test(name)) {
    return false;
  }

  if (item.priceCents <= 0 && categoryNames.length === 0) {
    return false;
  }

  return true;
}

async function main() {
  const { filePath, merchantId } = parseArgs(process.argv.slice(2));

  if (!filePath || !merchantId) {
    throw new Error(
      "Usage: node scripts/import_clover_export.mjs <xlsx-path> --merchant <merchant-id>"
    );
  }

  const scriptDir = path.dirname(fileURLToPath(import.meta.url));
  const parserPath = path.join(scriptDir, "parse_clover_export.py");
  const parsed = spawnSync("python3", [parserPath, filePath], {
    encoding: "utf8",
  });

  if (parsed.status !== 0) {
    throw new Error(parsed.stderr || parsed.stdout || "Failed to parse Clover export.");
  }

  const payload = JSON.parse(parsed.stdout);
  const uniqueCategories = uniqueByNormalizedName(
    payload.categories || [],
    (category) => category.name
  );

  const merchantConnection = await prisma.merchantConnection.findUnique({
    where: {
      cloverMerchantId: merchantId,
    },
  });

  if (!merchantConnection) {
    throw new Error(`Merchant connection ${merchantId} was not found.`);
  }

  const categoryIdMap = new Map();

  await prisma.modifierOption.deleteMany({
    where: {
      modifierGroup: {
        menuItem: {
          merchantConnectionId: merchantConnection.id,
        },
      },
    },
  });

  await prisma.modifierGroup.deleteMany({
    where: {
      menuItem: {
        merchantConnectionId: merchantConnection.id,
      },
    },
  });

  await prisma.menuItem.deleteMany({
    where: {
      merchantConnectionId: merchantConnection.id,
    },
  });

  await prisma.menuCategory.deleteMany({
    where: {
      merchantConnectionId: merchantConnection.id,
    },
  });

  for (const [index, category] of uniqueCategories.entries()) {
    const categoryName = cleanText(category.name);
    const categoryKey = slugify(categoryName);
    const cloverCategoryId = makeImportedId("category", categoryName, index);
    const savedCategory = await prisma.menuCategory.upsert({
      where: {
        merchantConnectionId_cloverCategoryId: {
          merchantConnectionId: merchantConnection.id,
          cloverCategoryId,
        },
      },
      create: {
        merchantConnectionId: merchantConnection.id,
        cloverCategoryId,
        name: categoryName,
        sortOrder: index,
        isActive: true,
      },
      update: {
        name: categoryName,
        sortOrder: index,
        isActive: true,
      },
    });

    categoryIdMap.set(categoryKey, savedCategory.id);
  }

  const importableItems = payload.items.filter(shouldImportMenuItem);

  for (const [itemIndex, item] of importableItems.entries()) {
    const itemName = cleanText(item.name);
    const itemDescription = cleanText(item.description);
    const primaryCategoryName = item.categoryNames?.[0] || null;
    const primaryCategoryKey = primaryCategoryName
      ? slugify(primaryCategoryName)
      : null;
    const cloverItemId =
      item.sourceId || makeImportedId("item", itemName, itemIndex);
    const savedItem = await prisma.menuItem.upsert({
      where: {
        merchantConnectionId_cloverItemId: {
          merchantConnectionId: merchantConnection.id,
          cloverItemId,
        },
      },
      create: {
        merchantConnectionId: merchantConnection.id,
        menuCategoryId: primaryCategoryKey
          ? categoryIdMap.get(primaryCategoryKey) || null
          : null,
        cloverItemId,
        name: itemName,
        description: itemDescription || null,
        priceCents: item.priceCents || 0,
        isAvailable: true,
        isHidden: !!item.hidden,
      },
      update: {
        menuCategoryId: primaryCategoryKey
          ? categoryIdMap.get(primaryCategoryKey) || null
          : null,
        name: itemName,
        description: itemDescription || null,
        priceCents: item.priceCents || 0,
        isAvailable: true,
        isHidden: !!item.hidden,
      },
    });

    for (const [groupIndex, groupName] of (item.modifierGroupNames || []).entries()) {
      if (!groupName) {
        continue;
      }

      const groupTemplate = payload.modifierGroups.find(
        (modifierGroup) => modifierGroup.name === groupName
      );

      const savedGroup = await prisma.modifierGroup.create({
        data: {
          menuItemId: savedItem.id,
          cloverModifierGroupId: makeImportedId(
            "modifier-group",
            `${savedItem.name}-${groupName}`,
            groupIndex
          ),
          name: groupName,
          minRequired: groupTemplate?.requiredQuantity || 0,
          maxAllowed: groupTemplate?.maxQuantity || 1,
        },
      });

      for (const [optionIndex, option] of (groupTemplate?.options || []).entries()) {
        await prisma.modifierOption.create({
          data: {
            modifierGroupId: savedGroup.id,
            cloverModifierId: makeImportedId(
              "modifier",
              `${groupName}-${option.name}`,
              optionIndex
            ),
            name: option.name,
            priceDeltaCents: option.priceCents || 0,
          },
        });
      }
    }
  }

  await prisma.syncEvent.create({
    data: {
      merchantConnectionId: merchantConnection.id,
      source: "spreadsheet",
      eventType: "menu.import.spreadsheet",
      payloadJson: payload,
      status: "received",
    },
  });

  await prisma.merchantConnection.update({
    where: {
      id: merchantConnection.id,
    },
    data: {
      lastSyncAt: new Date(),
      syncStatus: "spreadsheet_imported",
    },
  });

    const summary = {
    ok: true,
    merchantId,
    categoriesImported: uniqueCategories.length,
    itemsImported: payload.items.filter(shouldImportMenuItem).length,
    modifierGroupsImported: payload.modifierGroups.length,
    taxRatesDetected: payload.taxRates.length,
    note: "Spreadsheet data was imported into MenuCategory, MenuItem, ModifierGroup, and ModifierOption.",
  };

  console.log(JSON.stringify(summary, null, 2));
}

main()
  .catch(async (error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
