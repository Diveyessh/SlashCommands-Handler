const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('Provides information about the server.'),
    async execute(interaction) {
        const guild = interaction.guild;
        
        await interaction.reply({
            embeds: [{
                title: `Server Info: ${guild.name}`,
                thumbnail: { url: guild.iconURL() },
                fields: [
                    { name: 'Members', value: guild.memberCount.toString(), inline: true },
                    { name: 'Created', value: guild.createdAt.toDateString(), inline: true },
                    { name: 'Channels', value: guild.channels.cache.size.toString(), inline: true },
                    { name: 'Roles', value: guild.roles.cache.size.toString(), inline: true },
                    { name: 'Owner', value: `<@${guild.ownerId}>`, inline: true },
                    { name: 'Boosts', value: guild.premiumSubscriptionCount.toString(), inline: true }
                ],
                color: 0x5865F2
            }]
        });
    },
};