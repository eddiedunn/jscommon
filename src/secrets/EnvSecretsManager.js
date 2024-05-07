const SecretsManager = require('./SecretsManager');

class EnvSecretsManager extends SecretsManager {
    async getSecret(service, account) {
      // Optionally use account for environments where vars might be prefixed
      const key = account ? `${service}_${account}`.toUpperCase() : service.toUpperCase();
      return process.env[key];
    }
  }

  module.exports = EnvSecretsManager;
  