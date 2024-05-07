async function retrieveSecrets(managerType, service, account) {
    const manager = SecretsFactory.getManager(managerType);
    const secret = await manager.getSecret(service, account);
    console.log('Secret:', secret);
  }
  
  retrieveSecrets('env', 'MY_SERVICE', 'MY_ACCOUNT');
  retrieveSecrets('keychain', 'MyService', 'myAccount');