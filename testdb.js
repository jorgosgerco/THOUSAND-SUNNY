// testdb.js
const { addBerries, getUserData } = require('./database/dbFunctions.js');

async function runTest() {
    const testUserId = '123456789012345678'; // Use a random user ID for testing
    const berriesToAdd = 10;

    console.log(`Starting database test...`);

    try {
        // Get initial berries
        const initialData = await getUserData(testUserId);
        const initialBerries = initialData ? initialData.berries : 0;
        console.log(`User's initial berries: ${initialBerries}`);

        // Add berries
        await addBerries(testUserId, berriesToAdd);
        console.log(`Successfully attempted to add ${berriesToAdd} berries.`);

        // Get updated berries
        const updatedData = await getUserData(testUserId);
        const updatedBerries = updatedData ? updatedData.berries : 0;
        console.log(`User's new berries: ${updatedBerries}`);

        if (updatedBerries === initialBerries + berriesToAdd) {
            console.log("SUCCESS: Berries were added correctly to the database.");
        } else {
            console.error("FAILURE: Berries were not added correctly. Check your addBerries function.");
        }

    } catch (error) {
        console.error("An error occurred during the database test:", error);
    }
}

runTest();