let mongoose = require('mongoose')
let Schema = mongoose.Schema

let recordSchema = new Schema({
    date: { type: Date },
    leagueId: { type: mongoose.Schema.Types.ObjectId, ref: 'league' },
    map: { type: mongoose.Schema.Types.ObjectId, ref: 'map' },
    battleType: Number,
    winners: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    losers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    videoLink: String,
    writer: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
});

recordSchema.methods.getUserIds = function(userList) {
    let userIdLst = []
    for (let i = 0; i < userList.length; i++) {
        userIdLst.push(userList[i]._id)
    }
    return userIdLst
}

module.exports = mongoose.model('record', recordSchema);