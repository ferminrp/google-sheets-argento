#!/usr/bin/env node
/**
 * Adds category tags to data/cedears.json from data/cedear-tag-categories.json.
 *
 * Tags are matched by the Cedears ticker (BYMA). Each category label is appended
 * once per CEDEAR, preserving category order in the source file.
 *
 * Usage: node scripts/enrich-cedears-tags.js
 */
const fs = require('fs');
const path = require('path');

const cedearsPath = path.join(__dirname, '..', 'data', 'cedears.json');
const categoriesPath = path.join(__dirname, '..', 'data', 'cedear-tag-categories.json');

function buildTagsByTicker(categories) {
  const tagsByTicker = new Map();

  for (const category of Object.values(categories)) {
    const label = category.label;
    for (const ticker of category.tickers) {
      const code = ticker.toUpperCase();
      if (!tagsByTicker.has(code)) {
        tagsByTicker.set(code, []);
      }
      const tags = tagsByTicker.get(code);
      if (!tags.includes(label)) {
        tags.push(label);
      }
    }
  }

  return tagsByTicker;
}

function main() {
  const items = JSON.parse(fs.readFileSync(cedearsPath, 'utf8'));
  const categories = JSON.parse(fs.readFileSync(categoriesPath, 'utf8'));
  const tagsByTicker = buildTagsByTicker(categories);

  let tagged = 0;
  for (const item of items) {
    const code = item.Cedears.toUpperCase();
    const tags = tagsByTicker.get(code) || [];
    item.tags = tags;
    if (tags.length > 0) {
      tagged += 1;
    }
  }

  fs.writeFileSync(cedearsPath, JSON.stringify(items, null, 2) + '\n');
  console.log(`Tags aplicados: ${tagged}/${items.length} CEDEARs con al menos un tag`);
}

main();
