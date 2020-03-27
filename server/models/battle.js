let mongoose = require('mongoose')
let Schema = mongoose.Schema

let battleSchema = new Schema({
    name: {type: String, required: true, unique: true},
    description: String,
    tierMin: Number,
    tierMax: Number,
    teamList: [{ required: false, type: mongoose.Schema.Types.ObjectId, ref: 'team' }],
    type: String, //리그 방식(개인, 팀, 이벤트)
    isRound: Boolean,
    roundCount: {type: Number, default: 1 },
    managers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    onProgressing: {type: Boolean, default: true },
    //matches: [matchSchema],
})

module.exports = mongoose.model('battle', battleSchema);