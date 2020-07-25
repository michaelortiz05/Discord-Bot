//const axios = require('axios');
const fs = require('fs');
const {wit_token} = require('../../config.json');
const FileWriter = require("wav").FileWriter;
//console.log(wit_token);
module.exports = async (client, member, speaking) => {
    if (speaking) {
        console.log("speaking");
    }
    // console.log(client.voice.connections);
    if (client.voice.connections === null) {console.log("No voice connection");return;}
    if (member.id != '281229936746823691') {console.log("Wrong user");return;}

    const audio = client.voice.connections.get('447204257268236289').receiver.createStream("281229936746823691", {mode: "pcm"}); // change hard-code
    await audio.pipe(fs.createWriteStream('user_audio'));
    /*var outputFileStream = new FileWriter('audio.wav', {
        sampleRate: 48000,
        channels: 2
    });*/
  //  audio.pipe(outputFileStream);
    axios({
        method: 'post',
        url: 'https://api.wit.ai/speech?v=20200513',
        headers: {
            Authorization: "Bearer " + wit_token,
            'Content-Type': "raw"
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
    });

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