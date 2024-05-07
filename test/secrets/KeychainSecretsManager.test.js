jest.mock('keytar'); 

const keytar = require('keytar');
const KeychainSecretsManager = require('../../src/secrets/KeychainSecretsManager');

describe('KeychainSecretsManager', () => {
  test('should retrieve a secret from the keychain', async () => {
    keytar.getPassword.mockResolvedValue('password123');

    const manager = new KeychainSecretsManager();
    const secret = await manager.getSecret('MyService', 'myAccount');

    expect(secret).toEqual({ username: 'myAccount', password: 'password123' });
    expect(keytar.getPassword).toHaveBeenCalledWith('MyService', 'myAccount');
  });

  test('should handle errors when retrieving a secret', async () => {
    keytar.getPassword.mockRejectedValue(new Error('Failed to access keychain'));

    const manager = new KeychainSecretsManager();
    await expect(manager.getSecret('MyService', 'myAccount')).resolves.toBeNull();
  });
});
