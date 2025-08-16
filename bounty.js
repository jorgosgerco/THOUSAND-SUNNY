// bounty.js
const fs = require("fs").promises;
const path = require("path");
const bountyMilestoneEvent = require("./events/bountyMilestone.js");

const filePath = path.join(__dirname, "berries.json");

async function getBerriesData() {
  try {
    const data = await fs.readFile(filePath, "utf8");
    const parsedData = JSON.parse(data);

    // Konvertojmë të dhënat ekzistuese në formatin e ri, duke ruajtur vlerat e vjetra
    const newData = {};
    for (const userId in parsedData) {
      const value = parsedData[userId];
      if (typeof value === 'number') {
        newData[userId] = { berries: value, lastActive: Date.now() };
      } else {
        newData[userId] = {
            berries: value.berries || 0,
            lastActive: value.lastActive || Date.now()
        };
      }
    }
    return newData;
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
  return data[userId]?.berries || 0;
}

async function addBerries(userId, amount, channel) {
  const data = await getBerriesData();
  data[userId] = data[userId] || { berries: 0, lastActive: Date.now() };
  const current = data[userId].berries;
  const newAmount = current + amount;
  data[userId].berries = newAmount;
  data[userId].lastActive = Date.now();
  await saveBerriesData(data);

  if (newAmount > 0 && newAmount % 1000 === 0) {
    const userObject = channel.guild.members.cache.get(userId);
    if (userObject) {
      await bountyMilestoneEvent.execute(channel.client, userObject, newAmount, channel);
    }
  }

  return newAmount;
}

async function setBerries(userId, amount) {
  const data = await getBerriesData();
  data[userId] = data[userId] || { berries: 0, lastActive: Date.now() };
  data[userId].berries = amount;
  await saveBerriesData(data);
}

async function applyPenalties() {
  const data = await getBerriesData();
  const now = Date.now();
  const oneWeek = 7 * 24 * 60 * 60 * 1000;

  for (const userId in data) {
    const user = data[userId];
    if (user.lastActive && (now - user.lastActive) > oneWeek) {
      const penalty = Math.ceil(user.berries * 0.10);
      const newBerries = Math.max(0, user.berries - penalty);
      user.berries = newBerries;
      console.log(`Berries i ${userId} u ul me ${penalty} për shkak të inaktivitetit. Berries i ri: ${newBerries}`);
    }
  }
  await saveBerriesData(data);
}

module.exports = {
  getBerries,
  addBerries,
  setBerries,
  applyPenalties,
};