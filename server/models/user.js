var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    userId: String,
    userName: String,
    bNetId: String,
    tribe: String,
    created_date: { type: Date, default: Date.now  }
});

module.exports = mongoose.model('user', userSchema);