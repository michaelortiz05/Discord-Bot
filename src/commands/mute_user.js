const userController = require('../models/user.model');

module.exports = {
    name: 'mute_user',
    description: 'mutes a given user.',
    guildOnly: true,
    cooldown: 3,
    execute(args, guild, channel) {
     //   message.channel.send('I have detected that you want to mute a user named ' + args);
        userController.findOne({aliases: {"$regex": args , "$options": "i"}})
            .then(r => {
                if (!r) {
                    console.log("Could not find user");
                    channel.send("Sorry! Could not find user");
                } else {
                    guild.members.fetch(r.discord_id)
                        .then(user => {
                            if (!user) {
                                console.log("Could not find user")
                                channel.send("Sorry! Could not find user!")
                            } else {
                                user.voice.setMute(true, "for being a cunt")
                                    .then(result => {
                                        if (!result) {
                                            console.error("unable to mute");
                                            channel.send("Unable to mute");
                                        } else if (result) {
                                            channel.send("Muted " + r.aliases[0]);
                                        } else {
                                            console.error("Something went wrong");
                                            channel.send("Sorry! Something went wrong!");
                                        }
                                    }).catch(error => {
                                    console.error(error);
                                });
                            }
                            return;
                        }).catch(error => {
                        console.error(error);
                    });
                }
            });
    },
   /* execute(args, message) {
        userController.findOne({aliases: {"$regex": args , "$options": "i"}})
            .then(r => {
                if(!r) {
                    console.log("Could not find user");
                    message.channel.send('Sorry, I cannot find that user!');
                }
                else {
                    message.member.guild.members.fetch(r.discord_id)
                        .then(user => {
                            if (!user) {
                                console.log("Could not find user")
                                message.channel.send('Sorry, I cannot find that user!');
                            }
                            else {
                                user.voice.setMute(true, "for being a cunt")
                                    .then(result => {
                                        if (!result) {
                                            console.error("unable to mute");
                                            message.channel.send("Sorry! Something went wrong!");
                                        }
                                        else if (result) {
                                            message.channel.send("Muted " + r.aliases[0]);
                                        }
                                        else {
                                            message.channel.send("Sorry! Something went wrong!");
                                        }
                                    }).catch(error => {
                                    console.error(error);
                                });
                            }
                            return;
                        }).catch(error => {console.error(error);});
                }
            });
        },*/
    }