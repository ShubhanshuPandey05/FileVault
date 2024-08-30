const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  url: { type: String, required: true },
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  tempToken: String,
  tempTokenExpiry: String,
});

const File = mongoose.model('File', fileSchema);
module.exports = File;
