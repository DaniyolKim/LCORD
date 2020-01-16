let mongoose = require('mongoose')
let Schema = mongoose.Schema

let recordSchema = new Schema({
    date: { required: true, type: Date },
    battleId: { required: true, type: mongoose.Schema.Types.ObjectId, ref: 'battle' },
    roundNum: Number, //풀 라운드 방식일 경우
    map: { required: true, type: mongoose.Schema.Types.ObjectId, ref: 'map' },
    battleType: Number,
    winners: [{ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    losers: [{ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    videoLink: String,
    writer: { required: true, type: mongoose.Schema.Types.ObjectId, ref: 'user' },
});

recordSchema.methods.getUserIds = function(userList) {
    let userIdLst = []
    for (let i = 0; i < userList.length; i++) {
        userIdLst.push(userList[i]._id)
    }
    return userIdLst
}

module.exports = mongoose.model('record', recordSchema);