const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    name: String,
    sort: String,
})

module.exports = mongoose.model('Classify', schema)