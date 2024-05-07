const keytar = require('keytar');
const SecretsManager = require('./SecretsManager');

class KeychainSecretsManager extends SecretsManager {
  async getSecret(service, account) {
    try {
      const password = await keytar.getPassword(service, account);
      return { username: account, password };
    } catch (error) {
      console.error("Failed to retrieve secret:", error);
      return null;
    }
  }
}

module.exports = KeychainSecretsManager;
