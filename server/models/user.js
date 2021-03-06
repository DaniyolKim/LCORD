let mongoose = require('mongoose')
let Schema = mongoose.Schema

let crypto = require('crypto')
let encObj = require('../config/enc')

let userSchema = new Schema({
    userId: {type: String, required: true, unique: true, index: true},
    pwd: {type: String, required: true},
    userName: String,
    bNetId: String,
    nickName: String,
    tribe: String,
    afreecaId: String,
    tier: { type: Number, default: 0 },
    created_date: { type: Date, default: Date.now  },
    optionalInfo: { apm: Number, grade: String, comment: String },
    abilityScore: { type: Number, default: 0.0 },
    eloScore: { type: Number, default: 0 },
    role: { type: Number, default: 0 }, /*100:admin, 50:manager, 0:user*/
    nonAttendanceBattles: [{ required: false, type: mongoose.Schema.Types.ObjectId, ref: 'battle' }]
});

userSchema.methods.encryptPwd = function (pwd) {
    this.pwd = encPwdFunc(pwd)
}

userSchema.methods.comparePwd = function (pwd) {
    if (this.pwd === encPwdFunc(pwd)) {
        return true
    } else {
        return false
    }
}

let encPwdFunc = function(pwd) {
    return crypto.createHash(encObj.encType).update(pwd + encObj.mySalt).digest(encObj.algorithm)
}

module.exports = mongoose.model('user', userSchema);