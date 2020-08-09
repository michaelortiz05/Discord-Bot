//const axios = require('axios');
//const https = require('https');
const path = require('path');
const decode = require('../../decodeOpus');
const fs = require('fs');
const WitSpeech = require('node-witai-speech');
const {wit_token, guild_channel_maps, bot_admin} = require('../../config.json');
const ffmpeg = require('fluent-ffmpeg');
const content_type = "audio/wav";
var global = require('../../global');
//const FileWriter = require("wav").FileWriter;
//console.log(wit_token);
module.exports =  (client, member, speaking) => {
    // Close the writeStream when a member stops speaking
     //console.log("SPEAKING");
  //  console.log(speaking.bitfield === 1);
    if (speaking.bitfield === 1 && global.voice_settings.voiceChannel != null && global.voice_settings.listenConnection != null && member.id === bot_admin) {
        console.log("Speaking detected");
        let receiver = global.voice_settings.listenConnection.receiver.createStream(bot_admin, {mode: "pcm"});
        receiver.pipe(fs.createWriteStream('user_audio'));
        receiver.on('end', function() {
            processRawToWav('user_audio', 'user_audio_p.wav', function (data) {
                if (data != null) {
                    var text = data.text; // TEMPORARY
                   // var args = ""; // Temporary
                    if (text === undefined) return;
                    if (!text.startsWith('hey bot'));
                    else {
                        var commandName = data["intents"][0]["name"];
                        var args = data["entities"]["user:user"][0]["body"];
                     //   console.log('args: ' + args);
                        if (!client.commands.has(commandName)) return;

                        const command = client.commands.get(commandName);
                        const guild = member.guild;//client.guilds.cache.get("390964580333125632"); // 447204257268236289
                        console.log(guild.id);
                        const channel = guild_channel_maps[guild.id];//guild.channels.cache.get("390967739906260992"); // 675018486552068097
                        try {
                            command.execute_voice(args, guild, channel);
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
}

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