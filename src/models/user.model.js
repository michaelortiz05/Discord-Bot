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

let user = mongoose.model('user', user, "user");
module.exports = user;