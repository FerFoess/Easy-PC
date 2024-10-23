const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required:false,
    unique: true,
    trim: true,
  },

  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'user'], // Solo permite "admin" y "user" como roles
    default: 'user', // Por defecto será "user"
  },
  firstName: {
    type: String,
    required: false,
    trim: true,
  },
  lastName: {
    type: String,
    required: false,
    trim: true,
  },
  address: {
    type: String,
    required: false,
    trim: true,
  },
  phone: {
    type: String,
    required: false,
  },
  age: {
    type: Number,
    required: false,
    min: 0,
  },
});


module.exports = mongoose.model('User', UserSchema);
