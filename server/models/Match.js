// server/models/Match.js
const mongoose = require('mongoose');

const setSchema = new mongoose.Schema({
  myGames: { type: Number, required: true },
  oppGames: { type: Number, required: true },
});

const matchSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  sets: {
    type: [setSchema],
    default: [],
  },
  didWin: { type: Boolean, default: false },
  // Changed: make date required, remove default
  date: { type: Date, required: true },
  location: { type: String, default: "" },
});

module.exports = mongoose.model('Match', matchSchema);
