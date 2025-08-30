const db = require('./db.js');

// Function to get a user's data from the database
async function getUserData(userId) {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM users WHERE id = ?', [userId], (err, row) => {
            if (err) {
                console.error('Error getting user data:', err.message);
                return reject(err);
            }
            resolve(row);
        });
    });
}

// Function to add or update a user's berries and last active timestamp
async function addBerries(userId, amount) {
    return new Promise((resolve, reject) => {
        db.run(
            'INSERT INTO users (id, berries, lastActive) VALUES (?, ?, ?) ON CONFLICT(id) DO UPDATE SET berries = berries + ?, lastActive = ?',
            [userId, amount, Date.now(), amount, Date.now()],
            function (err) {
                if (err) {
                    console.error('Error adding berries:', err.message);
                    return reject(err);
                }
                resolve();
            }
        );
    });
}

// Add more functions here as you need them.
// For example, a function to get the top users:
async function getTopUsers(limit = 10) {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM users ORDER BY berries DESC LIMIT ?', [limit], (err, rows) => {
            if (err) {
                console.error('Error getting top users:', err.message);
                return reject(err);
            }
            resolve(rows);
        });
    });
}

module.exports = {
    getUserData,
    addBerries,
    getTopUsers,
};