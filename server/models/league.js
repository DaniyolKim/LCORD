let mongoose = require('mongoose')
let Schema = mongoose.Schema

let roundSchema = new Schema({
    name: {type: String, required: true, unique: true},
    matches: []
})

let leagueSchema = new Schema({
    name: {type: String, required: true, unique: true},
    description: String,
    tierMin: Number,
    tierMax: Number,
    teamCount: Number,
    type: String, //리그 방식(개인, 팀, 이벤트)
    managers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    onProgressing: {type: Boolean, default: true },
    rounds: roundSchema,
})

leagueSchema.methods.createRound = function () {
    for (let i = 0; i < this.teamCount; i++) {

    }
}

module.exports = mongoose.model('league', leagueSchema);