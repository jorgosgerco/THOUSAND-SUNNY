// database/db.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database/berries.db', (err) => {
    if (err) {
        console.error('Database connection error:', err.message);
    } else {
        console.log('Successfully connected to the berries database.');
    }
});

module.exports = db;