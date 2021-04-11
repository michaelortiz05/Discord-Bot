const ScriptureApi = require('scripture-api');
const {scripture_token} = require('../../config.json');
const scriptureApi = new ScriptureApi(scripture_token);

module.exports = {
    name: 'mute_user',
    description: 'mutes a given user.',
    guildOnly: true,
    cooldown: 3,
    execute(message) {
        const bibleId = 'de4e12af7f28f599-01' // King james bibleid
        scriptureApi.getBible(bibleId)
            .then((data) => {
                console.log(data);
            })
            .catch((error) => {
                console.log(error);
            });
    }
}