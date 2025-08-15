// events/guildMemberUpdate.js
const { Events } = require('discord.js');

const UNVERIFIED_ROLE_ID = '1403861136109076681'; // ID-ja e rolit 'Unverified'

module.exports = {
    name: Events.GuildMemberUpdate,
    async execute(oldMember, newMember) {
        // Kontrollojme nese perdoruesi mori nje rol te ri
        const newRoles = newMember.roles.cache;
        const oldRoles = oldMember.roles.cache;

        const hasNewRole = newRoles.some(role => !oldRoles.has(role.id));
        
        if (hasNewRole) {
            // Kontrollojme nese perdoruesi kishte rolin 'Unverified' me pare
            if (oldRoles.has(UNVERIFIED_ROLE_ID)) {
                try {
                    console.log(`[AutoRoleMonitor] Waiting 3 seconds before removing unverified role from ${newMember.user.tag}.`);
                    await new Promise(resolve => setTimeout(resolve, 3000));

                    // Heqim rolin 'Unverified'
                    const unverifiedRole = newMember.guild.roles.cache.get(UNVERIFIED_ROLE_ID);
                    if (unverifiedRole) {
                        await newMember.roles.remove(unverifiedRole);
                        console.log(`[AutoRoleMonitor] Removed unverified role from ${newMember.user.tag} after they gained a new role.`);
                    }
                } catch (error) {
                    console.error(`[AutoRoleMonitor] Failed to remove unverified role from ${newMember.user.tag}: ${error.message}`);
                }
            }
        }
    },
};