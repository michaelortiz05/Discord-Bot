const path = require('path');
//const fs = require('fs');
const {Wit, log} = require('node-wit');
const ScriptureApi = require('scripture-api');
const jsdom = require("jsdom");
const https = require('https');
const userController = require('../controllers/user.controller');
const {wit_token, scripture_token, message_channels, roles} = require('../../config');
var global = require('../../global');

const scriptureApi = new ScriptureApi(scripture_token); // Temp, will move when nlp functionalilty added

const wit_client = new Wit({
    accessToken: wit_token,
    logger: new log.Logger(log.DEBUG)
});

const { JSDOM } = jsdom;

module.exports =  (client, message) => {
    if (message.author == client.user) return;
    else if (message.author.bot) return;
    else if (!validate_channel(message)) return;

    // Restrict who can use the bot
    else if (!validate_role(message)) {
        message.channel.send('Sorry, you do not have access to this bot!').then(() => {
            console.log("Access restricted");
        });
    }

    // debug
    if (message.content == "!ping") {
        message.channel.send("!pong").then(() => {console.log("bot pinged!");});
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

    // Temporary - move this to nlp
    else if (message.content === '!bible-reading') {
        const bibleId = 'de4e12af7f28f599-01' // King James bibleid
        scriptureApi.getBibleBooks(bibleId, {includeChapters: false, includeChaptersAndSections: false})
            .then((books) => {
                //console.log(data["data"].length);
                let bookNum = Math.floor(Math.random() * books["data"].length);
                const bookId = books["data"][bookNum].id;

                scriptureApi.getBibleBookChapters(bibleId, bookId)
                    .then((chapters) => {
                        let chapterNum = Math.floor(Math.random() * chapters["data"].length);
                        const chapterId = chapters["data"][chapterNum].id;

                        scriptureApi.getBibleChapterVerses(bibleId, chapterId)
                            .then((verses) => {
                                let verseNum = Math.floor(Math.random() * verses["data"].length);
                                const verseId = verses["data"][verseNum].id;

                                const options = {
                                    host: 'api.scripture.api.bible',
                                    path: '/v1/bibles/' + bibleId + '/verses/' + verseId +
                                        '?content-type=html&include-notes=false&include-titles=false&include-chapter-numbers=true&include-verse-numbers=true&include-verse-spans=false&use-org-id=false',
                                    headers: {
                                        'accept': 'application/json',
                                        'api-key': scripture_token
                                    }
                                }
                                const req = https.request(options, res => {
                                    console.log(`statusCode: ${res.statusCode}`)
                                    var data = ''
                                    res.on('data', d => {
                                       // process.stdout.write(d);
                                        data += d;
                                    })

                                    res.on('end', d => {
                                        let obj = JSON.parse(data);
                                        console.log(obj['data']['content'] + "\n\n");
                                        const readingDom = new JSDOM(obj['data']['content']);
                                        let verseText = readingDom.window.document.querySelector("p").textContent;
                                        while (verseText.charAt(0).match(/^[0-9]+$/)) {
                                            verseText = verseText.substring(1);
                                        }
                                       // console.log(verseText);
                                        let ref = obj['data']['reference'];
                                        console.log(obj)
                                        message.channel.send(verseText + "\n" + ref)
                                            .then(() => console.log("verse sent"))
                                            .catch((error) => console.log(error));
                                    })
                                })

                                req.on('error', error => {
                                    console.error(error)
                                })

                                req.end();
                               /* const params = {
                                    contentType: "json",
                                    includeNotes: false,
                                    includeTitles: true,
                                    includeChapterNumbers: true,
                                    includeVerseNumbers: true,
                                    includeVerseSpans: false,
                                    paralles: ''
                                };*/

                               /* scriptureApi.getBibleVerses(bibleId, chapterId)
                                    .then((verse) => {
                                        console.log(verse);
                                    })
                                    .catch((error) => {
                                        console.log(error);
                                    })*/
                            })
                            .catch((error) => {
                                console.log(error);
                            })
                    })
                    .catch((error) => {
                        console.log(error);
                    })

            })
            .catch((error) => {
                console.log(error);
                message.channel.send("Something went wrong!");
            });
    }

    // logout
    else if (message.content === '!logout') {
        message.channel.send('Logging off').then(r => {
            client.destroy();
        });
    }

    // Process NLP
    else {
        var commandName = ""; // TEMPORARY
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

               /* if (!cooldowns.has(command.name)) {
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
                setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);*/

                try {
                    command.execute(message, args);
                } catch (error) {
                    console.error(error);
                    message.reply('there was an error trying to execute that command!').then(() => {return;});
                }
            })
            .catch(console.error)
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