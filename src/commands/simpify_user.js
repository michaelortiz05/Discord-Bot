const userController = require('../models/user.model');
const {simp_role} = require('../../config');
module.exports = {
    name: 'simpify_user',
    description: 'gives a user the simp role.',
    guildOnly: true,
    cooldown: 3,
    execute(message, args) {
        console.log("Simpify user");
      //  message.channel.send('I have detected that you want to make ' + args + " a simp.");
        userController.findOne({aliases: {"$regex": args , "$options": "i"}})
            .then(r => {
                if (!r) {
                    console.log("User not found!");
                    message.channel.send("Could not find user \"" + args + "\"");
                }
                else {
                    message.member.guild.members.fetch(r.discord_id)
                        .then(user => {
                            if (!user) {
                                console.log("User not found!");
                                message.channel.send("Could not find user \"" + args + "\"");
                            }
                            else {
                                console.log("Executing the simp protocol");
                                user.roles.set([simp_role])
                                    .then(() => {message.channel.send(args + " has been made a simp")})
                                    .catch(console.error);
                                // <insert simp directive here>
                            }
                        })
                }
            })
    },
};