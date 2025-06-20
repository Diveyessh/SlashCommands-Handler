require('dotenv').config();
const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');
const chalk = require('chalk');
const mongoose = require('mongoose');
const config = require('./config.json');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ],
    partials: [Partials.Message, Partials.Channel]
});

// Vibrant Console Logging
console.log(chalk.hex('#5865F2').bold(`
╔════════════════════════════╗
║      Zyra Bot Starting     ║
╚════════════════════════════╝
`));

client.commands = new Collection();
client.cooldowns = new Collection();
client.config = config;

// Database Connection
if (config.mongoDB.is_enabled) {
    mongoose.connect(process.env.MONGO_URI || config.mongoDB.mongoURL)
        .then(() => console.log(chalk.green('✅ MongoDB ') + chalk.white('Connection Established')))
        .catch(err => console.error(chalk.red('❌ MongoDB '), chalk.white(err)));
}

require('./handler')(client);

client.login(process.env.TOKEN || config.token)
    .then(() => console.log(chalk.hex('#57F287')('🔑 Logged in successfully!')))
    .catch(err => console.error(chalk.red('🔴 Login failed:'), err));