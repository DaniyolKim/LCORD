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
    tier: Number,
    created_date: { type: Date, default: Date.now  },
    optionalInfo: { apm: Number, grade: String, comment: String },
    abilityScore: { type: Number, default: 0.0 }
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