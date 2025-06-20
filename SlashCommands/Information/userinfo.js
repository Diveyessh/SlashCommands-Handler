const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Provides information about the user.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user you want info about')
                .setRequired(false)),
    async execute(interaction) {
        const user = interaction.options.getUser('target') || interaction.user;
        const member = await interaction.guild.members.fetch(user.id);
        
        await interaction.reply({
            embeds: [{
                title: `User Info: ${user.username}`,
                thumbnail: { url: user.displayAvatarURL() },
                fields: [
                    { name: 'ID', value: user.id, inline: true },
                    { name: 'Joined Server', value: member.joinedAt.toDateString(), inline: true },
                    { name: 'Account Created', value: user.createdAt.toDateString(), inline: true },
                    { name: 'Roles', value: member.roles.cache.size - 1, inline: true },
                    { name: 'Bot', value: user.bot ? 'Yes' : 'No', inline: true }
                ],
                color: 0x5865F2
            }]
        });
    },
};
