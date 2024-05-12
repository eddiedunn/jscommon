-- Drop tables if they already exist to reset the database
DROP TABLE IF EXISTS pairs_to_scan;
DROP TABLE IF EXISTS token;
DROP TABLE IF EXISTS univ2;
DROP TABLE IF EXISTS dex;
DROP TABLE IF EXISTS dex_type;
DROP TABLE IF EXISTS chain;

-- Create tables
CREATE TABLE chain (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  chain_name TEXT NOT NULL,
  chain_type TEXT NOT NULL,
  chainid_int INTEGER NOT NULL
);

CREATE TABLE dex_type (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  dex_type_name TEXT NOT NULL
);

CREATE TABLE dex (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  chainid INTEGER NOT NULL,
  dex_name TEXT NOT NULL,
  dex_typeid INTEGER NOT NULL,
  FOREIGN KEY (chainid) REFERENCES chain(id),
  FOREIGN KEY (dex_typeid) REFERENCES dex_type(id)
);

CREATE TABLE univ2 (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  dexid INTEGER NOT NULL,
  v2_router_address TEXT NOT NULL,
  factory_address TEXT NOT NULL,
  FOREIGN KEY (dexid) REFERENCES dex(id)
);

CREATE TABLE token (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  chainid INTEGER NOT NULL,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  FOREIGN KEY (chainid) REFERENCES chain(id)
);

CREATE TABLE pairs_to_scan (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  chainid INTEGER NOT NULL,
  ArbFor INTEGER NOT NULL,
  ArbAgainst INTEGER NOT NULL,
  FOREIGN KEY (chainid) REFERENCES chain(id),
  FOREIGN KEY (ArbFor) REFERENCES token(id),
  FOREIGN KEY (ArbAgainst) REFERENCES token(id)
);

-- Insert initial records
INSERT INTO chain (chain_name, chain_type, chainid_int) VALUES ('Ethereum', 'L1', 1);

INSERT INTO dex_type (dex_type_name) VALUES ('univ2');

-- Insert records into dex using fetched chainid
INSERT INTO dex (chainid, dex_name, dex_typeid) SELECT id, 'uniswap', (SELECT id FROM dex_type WHERE dex_type_name = 'univ2') FROM chain WHERE chain_name = 'Ethereum';
INSERT INTO dex (chainid, dex_name, dex_typeid) SELECT id, 'sushiswap', (SELECT id FROM dex_type WHERE dex_type_name = 'univ2') FROM chain WHERE chain_name = 'Ethereum';

-- Insert records into univ2 using fetched chainid
INSERT INTO univ2 (dexid, v2_router_address, factory_address) SELECT id, '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D', '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f' FROM dex WHERE dex_name = 'uniswap';
INSERT INTO univ2 (dexid, v2_router_address, factory_address) SELECT id, '0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F', '0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac' FROM dex WHERE dex_name = 'sushiswap';

-- Insert records into token using fetched chainid
INSERT INTO token (chainid, name, address) SELECT id, 'WETH', '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' FROM chain WHERE chain_name = 'Ethereum';
INSERT INTO token (chainid, name, address) SELECT id, 'DAI', '0x6B175474E89094C44Da98b954EedeAC495271d0F' FROM chain WHERE chain_name = 'Ethereum';
INSERT INTO token (chainid, name, address) SELECT id, 'USDC', '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' FROM chain WHERE chain_name = 'Ethereum';
INSERT INTO token (chainid, name, address) SELECT id, 'USDT', '0xdAC17F958D2ee523a2206206994597C13D831ec7' FROM chain WHERE chain_name = 'Ethereum';

INSERT INTO pairs_to_scan (chainid, ArbFor, ArbAgainst) SELECT id, (SELECT id FROM token WHERE name = 'WETH'), (SELECT id FROM token WHERE name = 'DAI') FROM chain WHERE chain_name = 'Ethereum';
INSERT INTO pairs_to_scan (chainid, ArbFor, ArbAgainst) SELECT id, (SELECT id FROM token WHERE name = 'WETH'), (SELECT id FROM token WHERE name = 'USDC') FROM chain WHERE chain_name = 'Ethereum';
INSERT INTO pairs_to_scan (chainid, ArbFor, ArbAgainst) SELECT id, (SELECT id FROM token WHERE name = 'WETH'), (SELECT id FROM token WHERE name = 'USDT') FROM chain WHERE chain_name = 'Ethereum';