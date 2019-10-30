let mongoose = require('mongoose')
let Schema = mongoose.Schema

let mapSchema = new Schema({
    name: {type: String, required: true, unique: true, index: true},
});

module.exports = mongoose.model('map', mapSchema);