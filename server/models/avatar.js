const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  image: {
    // 图
    url: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    }
  },
  classify_id: String,
  classify_name: String,

})

module.exports = mongoose.model('Avatar', schema)
