const EnvSecretsManager = require('../../src/secrets/EnvSecretsManager');

describe('EnvSecretsManager', () => {
  beforeAll(() => {
    // Set up environment variables for testing
    process.env['TEST_SERVICE_TEST_ACCOUNT'] = 'secretValue';
  });

  afterAll(() => {
    // Clean up environment variables
    delete process.env['TEST_SERVICE_TEST_ACCOUNT'];
  });

  test('should retrieve an environment variable as secret', async () => {
    const manager = new EnvSecretsManager();
    const secret = await manager.getSecret('TEST_SERVICE', 'TEST_ACCOUNT');
    expect(secret).toBe('secretValue');
  });

  test('should return undefined for non-existent secrets', async () => {
    const manager = new EnvSecretsManager();
    const secret = await manager.getSecret('NON_EXISTENT_SERVICE', 'NON_EXISTENT_ACCOUNT');
    expect(secret).toBeUndefined();
  });
});
