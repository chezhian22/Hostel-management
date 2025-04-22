const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
   
    hostelName: { 
      type: String
    },
    roomNumber: { 
      type: Number
    },
    name: { 
      type: String
    },
    rollNumber: { 
      type: String
    },
    email: { 
      type: String
    },
    about: { 
      type: String
    },
    description: {
        type: String
    },
    status: {
        type: Boolean
    },
    create_date:{
      type:Date
    },
    complete_date:{
      type:Date
    }
});

// Ensure unique indexes for fields like email and phoneNumber (if needed)

module.exports = mongoose.model('Complaint', complaintSchema);
