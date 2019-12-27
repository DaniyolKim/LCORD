let mongoose = require('mongoose')
let Schema = mongoose.Schema

let abilitySchema = new Schema({
    targetUser: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    build: Number,
    control: Number,
    judgement: Number,
    manageResource: Number,
    manageMulti: Number,
    totalScore: Number,
    writer: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
})

module.exports = mongoose.model('ability', abilitySchema);