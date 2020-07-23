const mongoose = require('mongoose');
const userController = require('./src/controllers/user.controller');
const Discord = require('discord.js');
const {Wit, log} = require('node-wit');
const fs = require('fs');

// Get sensitive configurations
const {bot_token, wit_token} = require('./config.json');

// Authenticate wit
const wit_client = new Wit({
    accessToken: wit_token,
    logger: new log.Logger(log.DEBUG)
});

// Start discord client
const client = new Discord.Client();

// Create command handler and cooldown handler
client.commands = new Discord.Collection();
const cooldowns = new Discord.Collection();

const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));

// Set commands
for (const file of commandFiles) {
    const command = require('./src/commands/' + file);
    client.commands.set(command.name, command);
}

// Handle bot commands
client.on('message', message => {
    //console.log(message.member.roles.cache);
    if (message.author == client.user) return;

    // Restrict who can use the bot
    if (!message.member.roles.cache.has('447204257268236289')) { // Change for empire upon deployment
        message.channel.send('Sorry, you do not have access to this bot!').then(() => {
            return;
        });
    }

    // add user to database
    if (message.content.startsWith("!add")) {
        const args = message.content.slice(4).trim().split(' ');
        var id = args.shift();
        id = id.substring(3, id.length - 1);
        if (!message.guild.members.cache.has(id)) {
            message.channel.send("Cannot find that user")
                .then(() => {return;})
                .catch(err => { console.error(err);});
        }
        else {
            userController.create(message, id, args);
        }
        return;
    }

    if (message.content === '!logout') {
        message.channel.send('Logging off').then(r => {
            client.destroy();
        });
        return;
    }
    // process message
    var commandName = message; // TEMPORARY
    var args = ""; // Temporary
    wit_client.message(message)
        .then((data) => {
            commandName = data["intents"][0]["name"];
            args = data["entities"]["user:user"][0]["body"];
            console.log(commandName)

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
                message.reply('there was an error trying to execute that command!').then(() => {return;});
            }
        })
        .catch(console.error)
})

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.login(bot_token)
    .then((r, error) => {
        if (error)
            throw error;
    })
    .catch(console.error);

mongoose.connect('mongodb://localhost:27017', {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("successfully connected to database.");
});