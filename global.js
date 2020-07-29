var Global = {
    voice_settings : {
        listenStreams: new Map(),
        voiceChannel: false,
        listening: false,
        listenConnection: null,
        listenReceiver: null,
        dispatcher: null
    }
};
module.exports = Global;