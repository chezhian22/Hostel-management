const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    hostelName: { 
      type: String
    },
    roomNumber: { 
      type: String
    },
    roomType: { 
      type: Number
    },
    occupied_carts:{
      type: Number
    }
});



module.exports = mongoose.model('Rooms', roomSchema);
