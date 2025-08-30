// bounty.js
const db = require("./database/db.js");

async function getBerries(userId) {
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

async function updateBounty(userId, berriesToAdd) {
    return new Promise((resolve, reject) => {
        db.run(
            'INSERT INTO users (id, berries, lastActive) VALUES (?, ?, ?) ON CONFLICT(id) DO UPDATE SET berries = berries + ?, lastActive = ?',
            [userId, berriesToAdd, Date.now(), berriesToAdd, Date.now()],
            function (err) {
                if (err) {
                    console.error('Error updating bounty:', err.message);
                    return reject(err);
                }
                console.log(`Successfully added ${berriesToAdd} berries to user ${userId}`);
                resolve();
            }
        );
    });
}

module.exports = { getBerries, updateBounty };