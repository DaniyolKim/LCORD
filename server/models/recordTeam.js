let mongoose = require('mongoose')
let Schema = mongoose.Schema

let recordTeamSchema = new Schema({
    battle: { required: true, type: mongoose.Schema.Types.ObjectId, ref: 'battle' },
    date: { required: true, type: Date },
    roundNum: { required: false, type: Number, default: 1 },
    leftTeam: { required: true, type: JSON, default: '' },
    rightTeam: { required: true, type: JSON, default: '' },
    recordList: [{ required: false, type: mongoose.Schema.Types.ObjectId, ref: 'record' }],
    mvp: { required: false, type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    videoLink: String,
});

module.exports = mongoose.model('recordTeam', recordTeamSchema);