const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  hostelName: {
    type: String,
  },
  roomNumber: {
    type: String,
  },
  roomType: {
    type: Number,
  },
  name: {
    type: String,
  },
  rollNumber: {
    type: String,
  },
  department: {
    type: String,
  },
  email: {
    type: String,
  },
  gender: {
    type: String,
  },
  phoneNumber: {
    // Removed validation
    type: Number,
  },
  address: {
    type: String,
  },
  check_in_date: {
    type: Date,
  },
  check_out_date: {
    type: Date,
  },
});

// Ensure unique indexes for fields like email and phoneNumber (if needed)
// studentSchema.index({ email: 1, phoneNumber: 1 }, { unique: true });

module.exports = mongoose.model("Student", studentSchema);
