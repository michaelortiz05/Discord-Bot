const userController = require('../models/user.model.js');

exports.create = (message, id, alias) => {
    userController.findOne({discord_id:id})
        .then(id_exist => {
            if (id_exist) {
               console.error("user already exists");
               message.channel.send("User already exists")
                   .then(() => {return;});
            }
            else {
                const new_user = new userController({discord_id: id, aliases: alias});
                new_user.save(function (err) {
                    if (err) message.channel.send("Something went wrong").then(() => {return;});
                    message.channel.send("User added").then(() => {return;});
                });
            }
        })
}