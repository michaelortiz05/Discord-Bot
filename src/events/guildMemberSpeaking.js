//const axios = require('axios');
//const https = require('https');
const path = require('path');
const decode = require('../../decodeOpus');
const fs = require('fs');
const WitSpeech = require('node-witai-speech');
const {wit_token} = require('../../config.json');
const ffmpeg = require('fluent-ffmpeg');
const content_type = "audio/wav";
var global = require('../../global');
//const FileWriter = require("wav").FileWriter;
//console.log(wit_token);
module.exports =  (client, member, speaking) => {
    // Close the writeStream when a member stops speaking
     //console.log("SPEAKING");
  //  console.log(speaking.bitfield === 1);
    if (speaking.bitfield === 1 && global.voice_settings.voiceChannel != null && global.voice_settings.listenConnection != null && member.id === "281229936746823691") {
        console.log("Speaking detected");
        let receiver = global.voice_settings.listenConnection.receiver.createStream("281229936746823691", {mode: "pcm"});
        receiver.pipe(fs.createWriteStream('user_audio'));
        receiver.on('end', function() {
            processRawToWav('user_audio', 'user_audio_p.wav', function (data) {
                if (data != null) {
                    var text = data.text; // TEMPORARY
                   // var args = ""; // Temporary

                    if (!text.startsWith('hey bot'));
                    else {
                        var commandName = data["intents"][0]["name"];
                        var args = data["entities"]["user:user"][0]["body"];
                     //   console.log('args: ' + args);
                        if (!client.commands.has(commandName)) return;

                        const command = client.commands.get(commandName);
                        const guild = client.guilds.cache.get("447204257268236289");
                        console.log(guild);
                        const channel = guild.channels.cache.get("675018486552068097");
                        try {
                            command.execute(args, guild, channel);
                        } catch (error) {
                            console.error(error);
                        //    message.reply('there was an error trying to execute that command!').then(() => {return;});
                        }
                    }
                }
            });
        });
        receiver.on('error', (error) => {
            console.error(error);
        });
        receiver.on('exit', (code) => {
            console.log(code);
        });
    }



        //!speaking && global.voice_settings.voiceChannel
   //     console.log("not speaking");
        /*let stream = global.voice_settings.listenStreams.get(member.id);
        if (stream) {
            global.voice_settings.listenStreams.delete(member.id);
            stream.end(err => {
                if (err) {
                    console.error(err);
                }

                let basename = path.basename(stream.path, '.opus_string');
                let text = "default";

                // decode file into pcm
                decode.convertOpusStringToRawPCM(stream.path,
                    basename,
                    (function() {
                        processRawToWav(
                            path.join('./recordings', basename + '.raw_pcm'),
                            path.join('./recordings', basename + '.wav'),
                            (function(data) {
                                if (data != null) {
                                //    handleSpeech(member, data._text);
                                    console.log("YAY!");
                                }
                            }).bind(this))
                    }).bind(this));*/
          //  });
      //  }


   /* if (speaking) {
        console.log("speaking");
    }
    // console.log(client.voice.connections);
    if (client.voice.connections === null) {console.log("No voice connection");return;}
    if (member.id != '281229936746823691') {console.log("Wrong user");return;}

    const audio = client.voice.connections.get('447204257268236289').receiver.createStream("281229936746823691", {mode: "pcm"}); // change hard-code
    var writeStream = fs.createWriteStream('user_audio')
    await audio.pipe(writeStream);
    //await audio.pipe(fs.createWriteStream('user_audio'));
    var stream = fs.createReadStream('user_audio');
    var content_type = "audio/raw";
    var parseSpeech =  new Promise((resolve, reject) => {
        // call the wit.ai api with the created stream
        WitSpeech.extractSpeechIntent(wit_token, stream, content_type,
            (err, res) => {
                if (err) return reject(err);
                resolve(res);
            });
    });

// check in the promise for the completion of call to witai
    parseSpeech.then((data) => {
        console.log(data);
    })
        .catch((err) => {
            console.log(err);
        });
    /*var outputFileStream = new FileWriter('audio.wav', {
        sampleRate: 48000,
        channels: 2
    });*/
  //  audio.pipe(outputFileStream);
    /*axios({
        method: 'post',
        url: 'https://api.wit.ai/speech?v=20200513',
        headers: {
            'Authorization': "Bearer " + wit_token,
            'Content-Type': "audio/raw"
        },
        params: {
            'encoding': 'signed-integer',
            'bits': 16,
            'rate': '48000',
            'endian': 'little'
        },
        data: {

        }
    }).then(function(response) {
        console.log(response.data);
        console.log(response.status);
        console.log(response.statusText);
        console.log(response.headers);
        console.log(response.config);
    }).catch(err => {
        console.error(err);
    }); */

    //while (speaking);
    /*fs.readFile(`user_audio`, function(err, result) {
        axios({
            method: 'post',
            url: 'https://api.wit.ai/speech?v=20200513',
            headers: {
                Authorization: "Bearer " + wit_token,
                'Content-Type': "audio/raw"
            },
            params: {
                'encoding': 'signed-integer',
                'bits': 16,
                'rate': '48000',
                'endian': 'little'
            },
            data: {
                binary: result
            }
        }).then(function(response) {
            console.log(response.data);
            console.log(response.status);
            console.log(response.statusText);
            console.log(response.headers);
            console.log(response.config);
        }).catch(err => {
            console.error(err);
        });
    });*/
    //wav.encode(stream, {sampleRate: 48000, float: true, bitDepth: 32 }).pipe(fs.createWriteStream('audio.wav'));

}
/*function processCommand(client, data) {
    var text = data.text; // TEMPORARY
    var args = ""; // Temporary
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
//}
function processRawToWav(filepath, outputpath, cb) {
    fs.closeSync(fs.openSync(outputpath, 'w'));
    var command = ffmpeg(filepath)
        .addInputOptions([
            '-f s16le',
            '-ar 48k',
            '-ac 2'
        ])
        .on('end', function() {
            console.log("end");
            // Stream the file to be sent to the wit.ai
            var stream = fs.createReadStream(outputpath);

            // Its best to return a promise
            var parseSpeech =  new Promise((resolve, reject) => {
                // call the wit.ai api with the created stream
                WitSpeech.extractSpeechIntent(wit_token, stream, content_type,
                    (err, res) => {
                        if (err) return reject(err);
                        resolve(res);
                    });
            });

            // check in the promise for the completion of call to witai
            parseSpeech.then((data) => {
                console.log(data);
                cb(data);
                //return data;
            })
                .catch((err) => {
                    console.log(err);
                    cb(null);
                    //return null;
                })
        })
        .on('error', function(err) {
            console.log('an error happened: ' + err.message);
        })
        .addOutput(outputpath)
        .run();
}