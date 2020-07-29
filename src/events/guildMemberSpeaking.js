//const axios = require('axios');
//const https = require('https');
const fs = require('fs');
const WitSpeech = require('node-witai-speech');
const {wit_token} = require('../../config.json');
//const FileWriter = require("wav").FileWriter;
//console.log(wit_token);
module.exports = async (client, member, speaking) => {
    if (speaking) {
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