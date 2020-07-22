module.exports = {
    name: 'mute_user',
    description: 'mutes a given user.',
    guildOnly: true,
    cooldown: 3,
    execute(message, args) {
        message.channel.send('Mute user intent.');
    },
};