// models/Option.js
const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  purpose: { type: String, required: true },
});

const Option = mongoose.model('Option', optionSchema);

module.exports = Option;