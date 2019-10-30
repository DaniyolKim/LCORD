let mongoose = require('mongoose')
let Schema = mongoose.Schema

let teamSchema = new Schema({
    leagueId: { type: mongoose.Schema.Types.ObjectId, ref: 'league' },
    name: String,
    leader1: String,
    leader2: String,
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    openTalkLink: String,
});

module.exports = mongoose.model('team', teamSchema);