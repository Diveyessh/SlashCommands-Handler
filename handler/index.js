const glob = require('glob');
const path = require('path');
const chalk = require('chalk');
const { SlashCommandBuilder } = require('discord.js');
const util = require('util');

const globPromise = util.promisify(glob); 

module.exports = async (client) => {
    const commandFiles = await globPromise(`${process.cwd()}/SlashCommands/**/*.js`);

    if (!Array.isArray(commandFiles)) {
        console.error('❌ commandFiles is not an array!');
        return;
    }

    commandFiles.forEach(file => {
        const command = require(file);
        if (!command.data?.name) return;

        if (!(command.data instanceof SlashCommandBuilder)) {
            command.data = new SlashCommandBuilder()
                .setName(command.name || command.data.name)
                .setDescription(command.description || command.data.description);
        }

        client.commands.set(command.data.name, command);
        console.log(chalk.blue(`⚡ Loaded `) + chalk.white(`${command.data.name}`));
    });

    // Events
    const eventFiles = await globPromise(`${process.cwd()}/events/*.js`);
    eventFiles.forEach(file => {
        const event = require(file);
        client[event.once ? 'once' : 'on'](event.name, (...args) => event.execute(...args, client));
        console.log(chalk.magenta(`🎯 Event `) + chalk.white(`${event.name}`) + chalk.magenta(` loaded`));
    });
};
