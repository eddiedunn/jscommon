class SecretsFactory {
    static getManager(type) {
      switch (type) {
        case 'env':
          return new EnvSecretsManager();
        case 'keychain':
          return new KeychainSecretsManager();
        default:
          throw new Error("Unknown secrets manager type");
      }
    }
  }
  