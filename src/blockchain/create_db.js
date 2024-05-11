const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./db/abi_cache.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the abi_cache.db database.');
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS chain (
    chainid INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    etherscan_base_url TEXT NOT NULL
  )`, (err) => {
    if (err) {
      console.error(err.message);
    }
  });

  db.run(`CREATE TABLE IF NOT EXISTS abi_cache (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    chainid INTEGER NOT NULL,
    contract TEXT NOT NULL,
    abi TEXT NOT NULL
  )`, (err) => {
    if (err) {
      console.error(err.message);
    }
  });

  db.run(`INSERT OR IGNORE INTO chain (chainid, name, etherscan_base_url) VALUES (1, 'Ethereum', 'https://api.etherscan.io/')`, (err) => {
    if (err) {
      console.error(err.message);
    }
  });
});

db.close((err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Close the database connection.');
});