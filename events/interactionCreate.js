const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const cooldowns = new Map();

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (!interaction.isChatInputCommand()) return;

        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        // Cooldown Handling
        if (!cooldowns.has(command.data.name)) {
            cooldowns.set(command.data.name, new Map());
        }

        const now = Date.now();
        const timestamps = cooldowns.get(command.data.name);
        const cooldownAmount = (command.cooldown || 3) * 1000;

        if (timestamps.has(interaction.user.id)) {
            const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;
            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;

                const cooldownEmbed = new EmbedBuilder()
                    .setColor(client.config.color?.error || 0xff0000)
                    .setTitle('⏳ Whoa there!')
                    .setDescription(`You're using commands too fast!\nWait **${timeLeft.toFixed(1)}s** to use \`/${command.data.name}\` again`)
                    .setFooter({ text: 'dsc.gg/zyra', iconURL: client.user.displayAvatarURL() });

                const row = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setLabel('Need Help?')
                        .setStyle(ButtonStyle.Link)
                        .setURL('https://dsc.gg/zyra')
                );

                return interaction.reply({ 
                    embeds: [cooldownEmbed], 
                    components: [row],
                    ephemeral: true 
                });
            }
        }

        timestamps.set(interaction.user.id, now);
        setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

        // Execute Command
        try {
            await command.execute(interaction, client);
        } catch (error) {
            console.error(error);

            const errorEmbed = new EmbedBuilder()
                .setColor(client.config.color?.error || 0xff0000)
                .setTitle('💥 Explosion Detected!')
                .setDescription('Our team of gnomes is working to fix this!')
                .setImage('https://i.imgur.com/yP2A9tf.gif');

            await interaction.reply({ 
                embeds: [errorEmbed],
                ephemeral: true 
            });
        }
    }
};
