// bountyPoster.js
const { createCanvas, loadImage, registerFont } = require("canvas");
const { AttachmentBuilder } = require("discord.js");
const fetch = require("node-fetch");
const path = require("path");

// Regjistro fontet
registerFont(path.join(__dirname, "assets/fonts/AlwaysInMyHeart.ttf"), { family: "Always In My Heart" });
registerFont(path.join(__dirname, "assets/fonts/PlayfairDisplay-Bold.ttf"), { family: "Playfair Display" });

// Funksion për pastrimin e emrit
function cleanUsername(name) {
    if (!name) return "";
    return name.normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9 ]/g, "")
        .trim();
}

// Funksioni për krijimin e posterit
async function createBountyPoster(member, bountyValue) {
    try {
        const canvas = createCanvas(877, 1240);
        const ctx = canvas.getContext("2d");

        const background = await loadImage(path.join(__dirname, "assets/wanted-bosh.png"));
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        const avatarURL = member.user.displayAvatarURL({ extension: "png", size: 1024 });
        const response = await fetch(avatarURL);
        const avatarBuffer = await response.buffer();
        const avatarImage = await loadImage(avatarBuffer);

        const destX = 82, destY = 268, destWidth = 712, destHeight = 515;
        const destRatio = destWidth / destHeight;
        const sourceRatio = avatarImage.width / avatarImage.height;

        let sourceX, sourceY, sourceWidth, sourceHeight;

        if (sourceRatio > destRatio) {
            sourceHeight = avatarImage.height;
            sourceWidth = avatarImage.height * destRatio;
            sourceX = (avatarImage.width - sourceWidth) / 2;
            sourceY = 0;
        } else {
            sourceWidth = avatarImage.width;
            sourceHeight = avatarImage.width / destRatio;
            sourceX = 0;
            sourceY = (avatarImage.height - sourceHeight) / 2;
        }

        ctx.drawImage(avatarImage, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);

        let displayName = member.nickname || member.user.username || member.guild.name;
        displayName = cleanUsername(displayName).slice(0, 10).toUpperCase();

        ctx.font = "bold 105px Playfair Display";
        ctx.fillStyle = "#412f17";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(displayName, 440, 954.5);

        ctx.font = "bold 100px Always In My Heart";
        ctx.fillStyle = "#412f17";
        // This is the crucial fix: ensure bountyValue is a number before calling toLocaleString()
        ctx.fillText(Number(bountyValue || 0).toLocaleString(), 425, 1080);

        const buffer = canvas.toBuffer();
        return new AttachmentBuilder(buffer, { name: "bounty.png" });
    } catch (error) {
        console.error("Gabim gjatë krijimit të posterit:", error);
        return null;
    }
}

module.exports = { createBountyPoster };