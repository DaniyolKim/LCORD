let mongoose = require('mongoose')
let Schema = mongoose.Schema

let teamSchema = new Schema({
    required: false,
    name: {type: String, required: true},
    captain: { required:false, type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    manager: { required:false, type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    members: [{ required:false, type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    openTalkLink: { type: String, default: '' },
});

let battleSchema = new Schema({
    name: {type: String, required: true, unique: true},
    description: String,
    tierMin: Number,
    tierMax: Number,
    teamList: [teamSchema],
    type: String, //리그 방식(개인, 팀, 이벤트)
    isRound: Boolean,
    roundCount: {type: Number, default: 1 },
    managers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    onProgressing: {type: Boolean, default: true },
})

module.exports = mongoose.model('battle', battleSchema);