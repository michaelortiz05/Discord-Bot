module.exports = {
    name: 'mute_user',
    description: 'mutes a given user.',
    guildOnly: true,
    cooldown: 3,
    execute(message, args) {
        message.channel.send('I have detected that you want to mute a user named ' + args);
    },
};