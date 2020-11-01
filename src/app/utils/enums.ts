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
  PASTEURIZED_FOR_MARKET = 'PASTEURIZED_FOR_MARKET',
}

export enum STOCK_FUNCTIONALITIES {
  /** In this case we just add products to the existing stock */
  PRODUCE = 'PRODUCE',

  /** This is the only case when product may go from one stock to another (e.g. SMALL_FREEZER => LARGE_FREEZER) */
  MARKET_PREPARATION = 'MARKET_PREPARATION',

  /** In this case the stock should be keep as a reference and a new Form should be use for a sale */
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

export enum AppRoutes {
  MARKETS_ADMIN = 'markets',
  PRODUCTS_ADMIN = 'products',
  SALE = 'sale',
  SYNC = 'sync',
  PRODUCE = 'produce',
  MARKET_PREPARATION = 'market_preparation',
}
