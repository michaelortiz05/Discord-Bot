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
    else if (message.content === "!summon") {
        if (message.member.voice.channel) {
            // console.log("here");
            await join(message.member.voice.channel).then(() => {
                console.log("Member joined");
            });
        }
        // return;
    }

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
    async function join(voiceChannel) {
        await voiceChannel.join();
    }
}