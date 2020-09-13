export enum PRODUCT_CATEGORIES {
  FRESH = 'FRESH',
  FROZEN = 'FROZEN',
  PASTEURIZED = 'PASTEURIZED',
}

export enum STOCK_CATEGORIES {
  FRESH = 'FRESH',
  SMALL_FREEZER = 'SMALL_FREEZER',
  LARGE_FREEZER = 'LARGE_FREEZER',
  PASTEURIZED = 'PASTEURIZED',
}

export enum STOCK_FUNCTIONALITIES {
  PRODUCE = 'PRODUCE',
  MARKET_PREPARATION = 'MARKET_PREPARATION',
  MARKET = 'MARKET',
}

export enum IdbStoresEnum {
  MARKETS = 'markets',
  PRODUCTS = 'products',
  STOCK = 'stock',
  MARKET_SALES = 'marketSales',
}

export enum UnsyncedTables {
  UNSYNCED_MARKETS = 'unsynced_markets',
}
