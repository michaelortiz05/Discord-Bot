const mongoose = require('mongoose');
const Discord = require('discord.js');
const fs = require('fs');
const client = new Discord.Client();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

fs.readFile('bot.json', (err, data) => {
    if (err) throw err;
    let config = JSON.parse(data);
    client.login(config["bot_token"])
        .then(r => {
            if (!r)
                throw err;
        })
        .catch(err => {
            console.log(err);
        });
})

mongoose.connect('mongodb://localhost:27017', {useNewUrlParser: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("successfully connected to database.");
});