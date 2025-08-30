// database/setupDatabase.js
const db = require('./db.js');

function setupDatabase() {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run(`CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                berries INTEGER,
                lastActive INTEGER
            )`, (err) => {
                if (err) {
                    console.error('Error creating table:', err.message);
                    return reject(err);
                }
                console.log("Database table 'users' is ready.");
                resolve();
            });
        });
    });
}

module.exports = setupDatabase;