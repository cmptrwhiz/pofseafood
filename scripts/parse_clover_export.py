#!/usr/bin/env python3

import json
import re
import sys
import zipfile
import xml.etree.ElementTree as ET


NS_MAIN = "http://schemas.openxmlformats.org/spreadsheetml/2006/main"
NS_REL = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
NS = {"a": NS_MAIN, "r": NS_REL}


def load_workbook(path: str):
    with zipfile.ZipFile(path) as workbook:
      shared_strings = []
      if "xl/sharedStrings.xml" in workbook.namelist():
          root = ET.fromstring(workbook.read("xl/sharedStrings.xml"))
          for si in root.findall("a:si", NS):
              shared_strings.append(
                  "".join((t.text or "") for t in si.iterfind(".//a:t", NS))
              )

      workbook_root = ET.fromstring(workbook.read("xl/workbook.xml"))
      rels_root = ET.fromstring(workbook.read("xl/_rels/workbook.xml.rels"))
      rel_map = {
          rel.attrib["Id"]: rel.attrib["Target"] for rel in rels_root
      }

      sheets = {}
      for sheet in workbook_root.find("a:sheets", NS):
          sheet_name = sheet.attrib["name"]
          target = "xl/" + rel_map[
              sheet.attrib[f"{{{NS_REL}}}id"]
          ]
          sheets[sheet_name] = parse_sheet(
              ET.fromstring(workbook.read(target)),
              shared_strings,
          )

      return sheets


def parse_sheet(root: ET.Element, shared_strings: list[str]):
    rows = []
    sheet_data = root.find("a:sheetData", NS)
    if sheet_data is None:
        return rows

    for row in sheet_data.findall("a:row", NS):
        cells = {}
        for cell in row.findall("a:c", NS):
            ref = cell.attrib.get("r", "")
            match = re.match(r"([A-Z]+)", ref)
            column = match.group(1) if match else ""
            value = ""
            value_node = cell.find("a:v", NS)
            if value_node is not None:
                if cell.attrib.get("t") == "s":
                    value = shared_strings[int(value_node.text)]
                else:
                    value = value_node.text or ""
            else:
                inline = cell.find("a:is", NS)
                if inline is not None:
                    value = "".join(
                        (t.text or "") for t in inline.iterfind(".//a:t", NS)
                    )
            cells[column] = value
        rows.append(cells)
    return rows


def clean_bool(value: str):
    normalized = (value or "").strip().lower()
    if normalized in {"yes", "true", "1"}:
        return True
    if normalized in {"no", "false", "0"}:
        return False
    return None


def parse_price(value: str):
    if value in ("", None):
        return 0
    try:
        return int(round(float(value) * 100))
    except ValueError:
        return 0


def split_multi(value: str):
    if not value:
        return []
    return [part.strip() for part in value.split(",") if part.strip()]


def normalize_header(value: str):
    return re.sub(r"[^a-z0-9]+", " ", (value or "").strip().lower()).strip()


def build_header_map(rows):
    if not rows:
        return {}
    return {
        normalize_header(value): column
        for column, value in rows[0].items()
        if (value or "").strip()
    }


def row_value(row, header_map, *header_names):
    for header_name in header_names:
        column = header_map.get(normalize_header(header_name))
        if column and row.get(column, "") != "":
            return row.get(column, "")
    return ""


def build_payload(sheets):
    items_sheet = sheets.get("Items", [])
    modifiers_sheet = sheets.get("Modifier Groups", [])
    categories_sheet = sheets.get("Categories", [])
    taxes_sheet = sheets.get("Tax Rates", [])

    item_header_map = build_header_map(items_sheet)
    modifier_header_map = build_header_map(modifiers_sheet)
    category_header_map = build_header_map(categories_sheet)
    tax_header_map = build_header_map(taxes_sheet)

    item_rows = items_sheet[1:] if len(items_sheet) > 1 else []
    modifier_rows = modifiers_sheet[1:] if len(modifiers_sheet) > 1 else []
    category_rows = categories_sheet[1:] if len(categories_sheet) > 1 else []
    tax_rows = taxes_sheet[1:] if len(taxes_sheet) > 1 else []

    categories = {}
    item_category_map = {}
    current_category = ""

    for row in category_rows:
        current_category = (
            row_value(row, category_header_map, "Category Name") or current_category
        )
        if not current_category:
            continue
        categories.setdefault(current_category, {"name": current_category})
        item_name = row_value(
            row,
            category_header_map,
            "Items in Category",
            "Item Sort Order",
            "Subcategory Name",
        )
        if item_name and item_name != current_category:
            item_category_map[item_name] = current_category

    modifier_groups = {}
    current_group = ""
    current_popup = ""

    for row in modifier_rows:
        current_group = (
            row_value(
                row,
                modifier_header_map,
                "Modifier Group Name",
                "Modifier group name",
            )
            or current_group
        )
        current_popup = (
            row_value(
                row,
                modifier_header_map,
                "Pop-up Automatically",
                "Pop up Automatically?",
            )
            or current_popup
        )
        modifier_name = row_value(row, modifier_header_map, "Modifier")
        if not current_group or not modifier_name:
            continue
        group = modifier_groups.setdefault(
            current_group,
            {
                "name": current_group,
                "popUpAutomatically": clean_bool(current_popup),
                "requiredQuantity": 0,
                "maxQuantity": 1,
                "options": [],
            },
        )
        required_quantity = row_value(
            row, modifier_header_map, "Required Quantity"
        )
        max_quantity = row_value(row, modifier_header_map, "Max Quantity")
        if required_quantity not in {"", None}:
            try:
                group["requiredQuantity"] = int(float(required_quantity))
            except ValueError:
                pass
        if max_quantity not in {"", None}:
            try:
                group["maxQuantity"] = int(float(max_quantity))
            except ValueError:
                pass

        group["options"].append(
            {
                "name": modifier_name,
                "priceCents": parse_price(
                    row_value(row, modifier_header_map, "Price")
                ),
            }
        )

    taxes = []
    for row in tax_rows:
        name = row_value(row, tax_header_map, "Name")
        if not name:
            continue
        taxes.append(
            {
                "name": name,
                "rate": row_value(row, tax_header_map, "Tax Rate"),
                "default": clean_bool(row_value(row, tax_header_map, "Default")),
            }
        )

    items = []
    known_modifier_groups = {group_name.strip() for group_name in modifier_groups.keys()}

    for row in item_rows:
        name = row_value(row, item_header_map, "Name")
        if not name:
            continue

        item_categories_raw = row_value(row, item_header_map, "Categories")
        category_names = split_multi(item_categories_raw)
        if not category_names and name in item_category_map:
            category_names = [item_category_map[name]]

        for category_name in category_names:
            categories.setdefault(category_name, {"name": category_name})

        modifier_group_names = [
            group_name
            for group_name in split_multi(
                row_value(row, item_header_map, "Modifier Groups")
            )
            if group_name in known_modifier_groups
        ]

        description = row_value(row, item_header_map, "Description")
        alternate_name = row_value(row, item_header_map, "Alternate Name")
        price_raw = row_value(row, item_header_map, "Price")
        if not re.search(r"\d", price_raw or ""):
            numeric_fallback = row.get("P", "")
            if re.search(r"\d", numeric_fallback or ""):
                price_raw = numeric_fallback

        if not description and alternate_name and alternate_name != name:
            description = alternate_name

        items.append(
            {
                "sourceId": row_value(row, item_header_map, "Clover ID") or row.get("T", ""),
                "name": name,
                "alternateName": alternate_name,
                "description": description,
                "priceCents": parse_price(price_raw),
                "priceType": row_value(row, item_header_map, "Price Type"),
                "priceUnit": row_value(row, item_header_map, "Price Unit"),
                "costCents": parse_price(row_value(row, item_header_map, "Cost")),
                "productCode": row_value(row, item_header_map, "Product Code"),
                "sku": row_value(row, item_header_map, "SKU"),
                "quantity": row_value(row, item_header_map, "Quantity"),
                "hidden": clean_bool(row_value(row, item_header_map, "Hidden")) or False,
                "nonRevenue": clean_bool(
                    row_value(row, item_header_map, "Non-revenue item")
                )
                or False,
                "printerLabels": split_multi(
                    row_value(row, item_header_map, "Printer Labels")
                ),
                "modifierGroupNames": modifier_group_names,
                "categoryNames": category_names,
                "taxRateNames": split_multi(
                    row_value(row, item_header_map, "Tax Rates")
                ),
                "variantAttribute": row_value(
                    row, item_header_map, "Variant Attribute"
                ),
                "variantOption": row_value(
                    row, item_header_map, "Variant Option"
                ),
            }
        )

    return {
        "items": items,
        "categories": list(categories.values()),
        "modifierGroups": list(modifier_groups.values()),
        "taxRates": taxes,
    }


def main():
    if len(sys.argv) < 2:
        raise SystemExit("Usage: parse_clover_export.py <xlsx-path>")

    sheets = load_workbook(sys.argv[1])
    payload = build_payload(sheets)
    print(json.dumps(payload))


if __name__ == "__main__":
    main()
