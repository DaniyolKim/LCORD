let mongoose = require('mongoose')
let Schema = mongoose.Schema

let teamSchema = new Schema({
    battleId: { type: mongoose.Schema.Types.ObjectId, ref: 'league' },
    name: String,
    captain: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    manager: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    openTalkLink: String,
});

module.exports = mongoose.model('team', teamSchema);