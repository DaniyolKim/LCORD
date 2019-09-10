var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    userId: String,
    userName: String,
    bNetId: String,
    tribe: String,
    created_date: { type: Date, default: Date.now  },
    optionalInfo: { apm: Number, grade: String, comment: String }
});

module.exports = mongoose.model('user', userSchema);