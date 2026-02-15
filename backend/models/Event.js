const mongoose = require('mongoose');
const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  organizer: { type: String, required: true },
  location: { type: String, required: true },
  dateTime: { type: Date, required: true },
  description: { type: String, default: '' },
  capacity: { type: Number, required: true, min: 1 },
  category: { type: String },
  seatsTaken: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
