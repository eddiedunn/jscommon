const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');
const os = require('os');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });

readline.question('Running this script will delete the existing database file. Do you want to continue? (yes/no) ', (answer) => {
  if (answer.toLowerCase() === 'yes') {
    const dir = path.join(os.homedir(), '.config');
    const dbPath = path.join(dir, 'arbitrage_config.db');

    // Connect to the SQLite database
    const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the arbitrage database.');
    });

    // SQL script to initialize database and insert records
    const sqlScript = fs.readFileSync(path.join(__dirname, 'sql', 'init_db.sql'), 'utf8');

    // Execute the SQL script
    db.exec(sqlScript, (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Database tables created and initial records inserted successfully.');
    }
    });

    // Close the database connection
    db.close((err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Closed the database connection.');
    });
  } else {
    console.log('Operation cancelled.');
    process.exit();
  }
  readline.close();
});


