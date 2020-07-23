const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const user = new Schema({
    discord_id: {
        type: String,
        required: true
    },
    privilege: {
        type: Number,
        default: 0,
        required: true
    },
    points: {
        type: Number,
        default: 10
    },
    aliases: {
        type: [String],
        default: undefined
    }
});

let new_user = mongoose.model('user', user, "users");
module.exports = new_user;