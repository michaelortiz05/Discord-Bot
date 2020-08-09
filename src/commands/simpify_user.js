const userController = require('../models/user.model');

module.exports = {
    name: 'simpify_user',
    description: 'gives a user the simp role.',
    guildOnly: true,
    cooldown: 3,
    execute(message, args) {
        message.channel.send('I have detected that you want to make ' + args + " a simp.");
    },
};