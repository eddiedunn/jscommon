class SecretsManager {
    async getSecret(service, account) {
      throw new Error("Method 'getSecret(service, account)' must be implemented.");
    }
  }

  module.exports = SecretsManager;
  