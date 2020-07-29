const path = require('path');
const fs = require('fs');
var global = require('../../global');
module.exports = async (client, message) => {
    if (message.author == client.user);
    else if (message.author.bot);
        //else if(message.channel.id != '735632215224090635');

    // Restrict who can use the bot
    else if (!message.member.roles.cache.has("447204257268236289")) { // Change for empire upon deployment 447204257268236289
        message.channel.send('Sorry, you do not have access to this bot!').then(() => {

        });
    }

    // add user to database
    else if (message.content.startsWith("!add")) {
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
    }
    else if (message.content === "!listen") {
        if(global.voice_settings.listening){message.reply("Already listening");return;}
        if (message.member && message.member.voice.channel) {
            global.voice_settings.listening = true;
            console.log("Voice setting: " + global.voice_settings.listening);
            global.voice_settings.voiceChannel = message.member.voice.channel;
            message.channel.send("Listening to " + message.member.voice.channel.name);
            var recordingsPath = path.join('.', 'recordings');
            makeDir(recordingsPath);

            global.voice_settings.voiceChannel.join().then((connection) => {
                //listenConnection.set(member.voiceChannelId, connection);
                global.voice_settings.listenConnection = connection;
                global.voice_settings.dipsatcher = connection.play(path.join(__dirname,"../audio/start.mp3"), {volume: 0.5});
                /*(global.voice_settings.dispatcher.on('start', () => {
                    console.log('audio.mp3 is now playing!');
                });
                global.voice_settings.dispatcher.on('finish', () => {
                    console.log("finished playing");
                    global.voice_settings.dispatcher.destroy();
                });
                global.voice_settings.dispatcher.on('error', console.error); */
                var receiver = connection.receiver.createStream("281229936746823691",{mode: "opus"});
              //  console.log("making reciever");
                global.voice_settings.listenConnection.on('speaking', function(user, data) {
              //      console.log("EVENT");
                    let hexString = data.toString('hex');
                    let stream = global.voice_settings.listenStreams.get(user.id);
                    if (!stream) {
                        if (hexString === 'f8fffe') {
                            return;
                        }
                        let outputPath = path.join(recordingsPath, `${user.id}-${Date.now()}.opus_string`);
                        stream = fs.createWriteStream(outputPath);
                        global.voice_settings.listenStreams.set(user.id, stream);
                    }
                    stream.write(`,${hexString}`);
                });
                //listenReceiver.set(member.voiceChannelId, receiver);
                global.voice_settings.listenReceiver = receiver;
            }).catch(console.error);
        }
            // console.log("here");
            /*const connection = await message.member.voice.channel.join();
            const dispatcher = connection.play(path.join(__dirname,"../audio/start.mp3"), {volume: 0.5});
            dispatcher.on('start', () => {
                console.log('audio.mp3 is now playing!');
            });
            dispatcher.on('finish', () => {
                console.log("finished");
                dispatcher.destroy();
            })
            dispatcher.on('error', console.error); */
            /*then(() => {

                console.log("Member joined");
            });*/
        }
        // return;

    // logout
    else if (message.content === '!logout') {
        message.channel.send('Logging off').then(r => {
            client.destroy();
        });
    }

    /*else {
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
    }*/
    // process message
   /* function join(voiceChannel) {
       return voiceChannel.join();
   }*/
}
function makeDir(dir) {
    try {
        fs.mkdirSync(dir);
    } catch (err) {}
}