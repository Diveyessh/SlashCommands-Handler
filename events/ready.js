const { ActivityType, EmbedBuilder } = require('discord.js');
const client = require('../index');
const figlet = require('figlet');
const chalk = require('chalk');

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        // ASCII Art Banner
        figlet(client.user.username, (err, data) => {
            if (err) return;
            console.log(chalk.hex('#FF73FA')(data));
        });

        // Vibrant Status Rotation
        const statuses = [
            { name: '/help | dsc.gg/zyra', type: ActivityType.Playing },
            { name: `${client.guilds.cache.size} servers`, type: ActivityType.Watching },
            { name: `${client.users.cache.size} users`, type: ActivityType.Listening }
        ];

        let current = 0;
        setInterval(() => {
            client.user.setPresence({
                activities: [statuses[current]],
                status: 'online'
            });
            current = (current + 1) % statuses.length;
        }, 30000);

        // Register Commands with Flair
        try {
            await client.application.commands.set([...client.commands.values()].map(c => c.data));
            console.log(chalk.green(`✨ Registered ${client.commands.size} commands with style!`));
            
            // Send Ready Message to Specified Channel
            if (client.config.readyChannel) {
                const channel = client.channels.cache.get(client.config.readyChannel);
                if (channel) {
                    const readyEmbed = new EmbedBuilder()
                        .setColor(client.config.color.primary)
                        .setTitle('🚀 Zyra is Online!')
                        .setDescription(`Loaded ${client.commands.size} commands\nServing ${client.guilds.cache.size} servers`)
                        .setThumbnail(client.user.displayAvatarURL())
                        .setImage('https://i.imgur.com/KR9KUGm.gif');
                    
                    await channel.send({ embeds: [readyEmbed] });
                }
            }
        } catch (error) {
            console.error(chalk.red('🔥 Command registration failed:'), error);
        }
    }
};