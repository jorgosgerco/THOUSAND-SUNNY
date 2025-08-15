// bounty.js
const fs = require("fs").promises;
const path = require("path");

const filePath = path.join(__dirname, "berries.json");

async function getBerriesData() {
  try {
    const data = await fs.readFile(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    if (error.code === "ENOENT") {
      await fs.writeFile(filePath, "{}", "utf8");
      return {};
    }
    console.error("Gabim gjatë leximit të berries.json:", error);
    return {};
  }
}

async function saveBerriesData(data) {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
  } catch (error) {
    console.error("Gabim gjatë shkrimit në berries.json:", error);
  }
}

async function getBerries(userId) {
  const data = await getBerriesData();
  return data[userId] || 0;
}

async function addBerries(userId, amount) {
  const data = await getBerriesData();
  const current = data[userId] || 0;
  const newAmount = current + amount;
  data[userId] = newAmount;
  await saveBerriesData(data);
  return newAmount;
}

async function setBerries(userId, amount) {
  const data = await getBerriesData();
  data[userId] = amount;
  await saveBerriesData(data);
}

module.exports = { getBerries, addBerries, setBerries };
