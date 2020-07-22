const mongoose = require('mongoose');
const Discord = require('discord.js');
const {bot_token, wit_token} = require('./config.json');
const fs = require('fs');

const client = new Discord.Client();
client.commands = new Discord.Collection();
const cooldowns = new Discord.Collection();

const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require('./src/commands/${file}');
    client.commands.set(command.name, command);
}

client.on('message', message => {
    const commandName = message; // TEMPORARY
    const args = "poop"; // Temporary
    if (!client.commands.has(commandName)) return;

    const command = client.commands.get(commandName);

    if (command.guildOnly && message.channel.type !== 'text') {
        return message.reply('I can\'t execute that command inside DMs!');
    }
    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
        }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }
})

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.login(bot_token)
    .then(r => {
        if (!r)
            throw err;
    })
    .catch(err => {
        console.log(err);
    });

mongoose.connect('mongodb://localhost:27017', {useNewUrlParser: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("successfully connected to database.");
});