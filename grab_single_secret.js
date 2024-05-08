const readline = require('readline');
const KeychainSecretsManager = require('./src/secrets/KeychainSecretsManager');

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Create an instance of KeychainSecretsManager
const keychainManager = new KeychainSecretsManager();

function askQuestion(question, defaultValue) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer || defaultValue);
    });
  });
}

async function main() {
  try {
    const service = await askQuestion('Enter the service name: ', 'simple_secret');
    const account = await askQuestion('Enter the account name: ');

    // Retrieve the secret using the keychain manager
    const secret = await keychainManager.getSecret(service, account);
    console.log(`Retrieved secret for ${account} at ${service}:`, secret);

  } catch (error) {
    console.error('Error retrieving secret:', error);
  } finally {
    rl.close();
  }
}

main();


//simple_auth