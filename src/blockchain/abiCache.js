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
    abiDB.get("SELECT abi FROM abi_cache WHERE chainid = ? AND contract = ?", [chainId, contractAddress], async (err, row) => {
      if (err) {
        reject(err);
        return;
      }

      if (row) {
        resolve(JSON.parse(row.abi));
      } else {
        // remove 5 second wait below if you have an Etherscan API key
        // const apiKey = process.env.ETHERSCAN_API_KEY;
        // const url = `${etherscanBaseUrl}/api?module=contract&action=getabi&address=${contractAddress}&apikey=${apiKey}`;
        const url = `${etherscanBaseUrl}/api?module=contract&action=getabi&address=${contractAddress}`;
        try {
          const response = await axios.get(url);
          if (response.data.status === '1' && response.data.message.startsWith('OK')) {
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
        await delay(5000); // wait for 5 seconds for rate limiting
      }
    });
  });
};

module.exports = { getOrFetchAbi };