
module.exports = (client, member, speaking) => {
    console.log("here");
    if (speaking) {
        console.log("speaking");
    }
    // console.log(client.voice.connections);
    if (client.voice.connections === null) {console.log("nope-1");return;}
    if (member.id != '281229936746823691') {console.log("nope");return;}
}