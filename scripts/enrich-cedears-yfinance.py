#!/usr/bin/env python3
"""
Enrich data/cedears.json with company metadata from Yahoo Finance (yfinance).

Uses TickerOriginal (underlying ticker) to fetch profile data and stores it in a
"yfinance-metadata" object on each CEDEAR entry.

Prerequisites:
  python3 -m venv .venv
  source .venv/bin/activate
  pip install -r requirements.txt

Usage:
  python scripts/enrich-cedears-yfinance.py
  python scripts/enrich-cedears-yfinance.py --limit 5 --dry-run
  python scripts/enrich-cedears-yfinance.py --force-refresh

After enriching, regenerate the static API:
  npm run build
"""
from __future__ import annotations

import argparse
import json
import sys
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import yfinance as yf

ROOT = Path(__file__).resolve().parent.parent
DEFAULT_INPUT = ROOT / "data" / "cedears.json"
DEFAULT_CACHE = ROOT / "data" / ".yfinance-cache.json"

US_MARKETS = {
    "NYSE",
    "NASDAQ",
    "NASDAQ GS",
    "NASDAQ GM",
    "NASDAQ CM",
    "NYSE Arca",
    "NYSE ARCA",
    "NYSE American",
    "CBOE",
    "OTC",
    "OTC US",
    "-",
    "New York",
}

MARKET_SUFFIX = {
    "B3": ".SA",
    "BOVESPA": ".SA",
    "XETRA": ".DE",
    "FRANKFURT": ".DE",
    "LONDON STOCK EXCHANGE": ".L",
}

INFO_FIELD_MAP = {
    "long_description": "longBusinessSummary",
    "city": "city",
    "state": "state",
    "country": "country",
    "zip": "zip",
    "address": "address1",
    "sector": "sector",
    "industry": "industry",
    "website": "website",
    "phone": "phone",
    "employees": "fullTimeEmployees",
    "long_name": "longName",
    "short_name": "shortName",
    "exchange": "exchange",
    "quote_type": "quoteType",
    "currency": "currency",
    "logo_url": "logo_url",
}


def market_suffix(market: str) -> str:
    market = (market or "").strip()
    if market in US_MARKETS:
        return ""
    return MARKET_SUFFIX.get(market, "")


def candidate_symbols(ticker_original: str, market: str) -> list[str]:
    ticker = ticker_original.strip()
    suffix = market_suffix(market)
    candidates: list[str] = []
    if suffix:
        candidates.append(f"{ticker}{suffix}")
    candidates.append(ticker)
    # Deduplicate while preserving order.
    seen: set[str] = set()
    ordered: list[str] = []
    for symbol in candidates:
        if symbol not in seen:
            seen.add(symbol)
            ordered.append(symbol)
    return ordered


def utc_now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def load_json(path: Path) -> Any:
    with path.open(encoding="utf-8") as handle:
        return json.load(handle)


def save_json(path: Path, payload: Any) -> None:
    with path.open("w", encoding="utf-8") as handle:
        json.dump(payload, handle, indent=2, ensure_ascii=False)
        handle.write("\n")


def load_cache(path: Path) -> dict[str, Any]:
    if not path.exists():
        return {}
    return load_json(path)


def save_cache(path: Path, cache: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    save_json(path, cache)


def has_useful_data(metadata: dict[str, Any]) -> bool:
    if metadata.get("error"):
        return False
    for key in INFO_FIELD_MAP:
        value = metadata.get(key)
        if value not in (None, ""):
            return True
    return False


def extract_metadata(info: dict[str, Any], yahoo_symbol: str, fetched_at: str) -> dict[str, Any]:
    metadata: dict[str, Any] = {
        "yahoo_symbol": yahoo_symbol,
        "fetched_at": fetched_at,
    }
    for out_key, info_key in INFO_FIELD_MAP.items():
        value = info.get(info_key)
        if value not in (None, ""):
            metadata[out_key] = value
    if len(metadata) == 2:
        metadata["error"] = "no_data"
    return metadata


def fetch_metadata_for_symbol(yahoo_symbol: str) -> dict[str, Any]:
    fetched_at = utc_now_iso()
    try:
        info = yf.Ticker(yahoo_symbol).info or {}
    except Exception as exc:  # noqa: BLE001 - best-effort enrichment
        return {
            "yahoo_symbol": yahoo_symbol,
            "fetched_at": fetched_at,
            "error": f"fetch_error: {exc.__class__.__name__}",
        }

    if not info or info.get("regularMarketPrice") is None and not any(
        info.get(key) for key in INFO_FIELD_MAP.values()
    ):
        return {
            "yahoo_symbol": yahoo_symbol,
            "fetched_at": fetched_at,
            "error": "no_data",
        }

    return extract_metadata(info, yahoo_symbol, fetched_at)


def resolve_metadata(
    ticker_original: str,
    market: str,
    cache: dict[str, Any],
    force_refresh: bool,
) -> dict[str, Any]:
    for yahoo_symbol in candidate_symbols(ticker_original, market):
        cache_key = yahoo_symbol
        if not force_refresh and cache_key in cache:
            cached = cache[cache_key]
            if has_useful_data(cached) or cached.get("error"):
                return dict(cached)

        metadata = fetch_metadata_for_symbol(yahoo_symbol)
        cache[cache_key] = metadata
        if has_useful_data(metadata):
            return metadata

    # Return the last attempt (with error) if all candidates failed.
    last_symbol = candidate_symbols(ticker_original, market)[-1]
    return dict(cache.get(last_symbol, {"yahoo_symbol": last_symbol, "fetched_at": utc_now_iso(), "error": "no_data"}))


def format_item(item: dict[str, Any], metadata: dict[str, Any]) -> dict[str, Any]:
    return {
        "Cedears": item["Cedears"],
        "Name": item["Name"],
        "Market": item["Market"],
        "Ratio": item["Ratio"],
        "TickerOriginal": item["TickerOriginal"],
        "yfinance-metadata": metadata,
    }


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Enrich data/cedears.json with yfinance metadata using TickerOriginal."
    )
    parser.add_argument("--input", type=Path, default=DEFAULT_INPUT, help="Input/output cedears JSON")
    parser.add_argument("--cache", type=Path, default=DEFAULT_CACHE, help="Local yfinance response cache")
    parser.add_argument("--limit", type=int, default=0, help="Process only the first N entries")
    parser.add_argument("--dry-run", action="store_true", help="Do not write JSON; print summary only")
    parser.add_argument("--force-refresh", action="store_true", help="Ignore cache and refetch all symbols")
    parser.add_argument("--sleep", type=float, default=0.3, help="Seconds to sleep between network requests")
    return parser.parse_args()


def main() -> int:
    args = parse_args()

    if not args.input.exists():
        print(f"Input not found: {args.input}", file=sys.stderr)
        return 1

    cedears = load_json(args.input)
    if not isinstance(cedears, list):
        print("Input JSON must be an array", file=sys.stderr)
        return 1

    items = cedears[: args.limit] if args.limit > 0 else cedears
    cache = {} if args.force_refresh else load_cache(args.cache)

    enriched: list[dict[str, Any]] = []
    hits = 0
    misses = 0
    fetched = 0

    for index, item in enumerate(items):
        ticker_original = item["TickerOriginal"]
        market = item.get("Market", "")
        symbols = candidate_symbols(ticker_original, market)

        used_cache = (
            not args.force_refresh
            and any(symbol in cache and (has_useful_data(cache[symbol]) or cache[symbol].get("error")) for symbol in symbols)
        )

        metadata = resolve_metadata(ticker_original, market, cache, args.force_refresh)
        enriched.append(format_item(item, metadata))

        if has_useful_data(metadata):
            hits += 1
        else:
            misses += 1
            print(
                f"warning: no data for {item['Cedears']} ({ticker_original}, {market}) -> {metadata.get('yahoo_symbol')}: {metadata.get('error', 'no_data')}",
                file=sys.stderr,
            )

        if not used_cache and args.sleep > 0 and index < len(items) - 1:
            fetched += 1
            time.sleep(args.sleep)

    if args.limit > 0:
        enriched.extend(cedears[args.limit :])

    if not args.dry_run:
        save_json(args.input, enriched)
        save_cache(args.cache, cache)

    print(
        f"Processed {len(items)} entries: {hits} with metadata, {misses} with errors"
        + (" (dry-run, no files written)" if args.dry_run else "")
    )
    if fetched:
        print(f"Network requests: ~{fetched}")

    return 0 if misses == 0 else 0


if __name__ == "__main__":
    raise SystemExit(main())
