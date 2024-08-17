const mongoose = require('mongoose');
const roomSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },
  files: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'File' }
  ]
});

const Room = mongoose.model('Room', roomSchema);
module.exports = Room;
