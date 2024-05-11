const sqlite3 = require('sqlite3').verbose();
const axios = require('axios');
require('dotenv').config();
const delay = ms => new Promise(res => setTimeout(res, ms));
const fs = require('fs');
const path = require('path');
const os = require('os');

const dir = path.join(os.homedir(), '.local', 'share');
const dbPath = path.join(dir, 'abi_cache.db');

const abiDB = new sqlite3.Database(dbPath);

const getOrFetchAbi = (chainId, contractAddress, etherscanBaseUrl) => {
  return new Promise((resolve, reject) => {
    console.log(`Fetching ${contractAddress} ABI from cache or Etherscan...`);
    abiDB.get("SELECT abi FROM abi_cache WHERE chainid = ? AND contract = ?", [chainId, contractAddress], async (err, row) => {
      if (err) {
        reject(err);
        return;
      }

      if (row) {
        resolve(JSON.parse(row.abi));
      } else {
        // const apiKey = process.env.ETHERSCAN_API_KEY;
        // const url = `${etherscanBaseUrl}/api?module=contract&action=getabi&address=${contractAddress}&apikey=${apiKey}`;
        const url = `${etherscanBaseUrl}/api?module=contract&action=getabi&address=${contractAddress}`;

        try {
          await delay(2000); // wait for 2 seconds
          const response = await axios.get(url);
          if (response.data.status === '1' && response.data.message === 'OK') {
            const abi = JSON.parse(response.data.result);
            abiDB.run("INSERT INTO abi_cache (chainid, contract, abi) VALUES (?, ?, ?)", [chainId, contractAddress, JSON.stringify(abi)], err => {
              if (err) {
                reject(err);
                return;
              }
              resolve(abi);
            });
          } else {
            reject('Failed to fetch ABI');
          }
        } catch (error) {
          console.error('Error fetching ABI from Etherscan:', error);
          reject(error);
        }
      }
    });
  });
};

module.exports = { getOrFetchAbi };