const path = require('path');
const fs = require('fs');
const userController = require('../controllers/user.controller');
const {allowed_users, message_channels, roles} = require('../../config');
var global = require('../../global');
module.exports =  (client, message) => {
    if (message.author == client.user) return;
    else if (message.author.bot) return;
    else if (!validate_channel(message)) ;

    // Restrict who can use the bot
    else if (!validate_role(message)) {
        message.channel.send('Sorry, you do not have access to this bot!').then(() => {
            console.log("Access restricted");
        });
    }

    // add user to database
    else if (message.content.startsWith("!add")) {
        const args = message.content.slice(4).trim().split(' ');
        var id = args.shift();
        id = id.substring(3, id.length - 1);
        if (!message.guild.members.cache.has(id)) {
            message.channel.send("Cannot find that user")
                .then(() => {
                    return;
                })
                .catch(err => {
                    console.error(err);
                });
        } else {
            userController.create(message, id, args);
        }
    }

    // Listen for voice commands
    else if (message.content === "!listen") {
        if (global.voice_settings.listening) {
            message.reply("already listening");
            return;
        }
        if (message.member && message.member.voice.channel) {
            global.voice_settings.listening = true;
            console.log("Voice setting: " + global.voice_settings.listening);
            global.voice_settings.voiceChannel = message.member.voice.channel;
            message.channel.send("Listening to " + message.member.voice.channel.name);

            global.voice_settings.voiceChannel.join().then((connection) => {
                global.voice_settings.listenConnection = connection;
                global.voice_settings.dipsatcher = connection.play(path.join(__dirname, "../audio/start.mp3"), {volume: 0.5});
            });
        } else message.reply("please join a voice channel!");
    }

    // logout
    else if (message.content === '!logout') {
        message.channel.send('Logging off').then(r => {
            client.destroy();
        });
    }
}

function validate_role(message) {
    var role;
  //  console.log(message.member.roles.cache);
    for (role of roles) {
        if (message.member.roles.cache.has(role)) return true;
    }
    return false;
}

function validate_channel(message) {
    var channel;
    for (channel of message_channels) {
        if (channel === message.channel.id) return true;
    }
    return false;
}