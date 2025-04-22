const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const cors = require("cors");
const User = require("./models/Users"); // Import User schema
const Student = require("./models/Student"); // Import Student schema
const Complaint = require("./models/Complains");
const Rooms = require("./models/Rooms");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect("mongodb://localhost:27017/hostel2", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Signup Route
app.post("/signup", async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Signup failed", error: error.message });
  }
});

// Login Route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      message: "Login successful!",
      user: {
        name: user.name,
        email: user.email,
        role: user.role, // Do not send the password back
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
});

// Add Student Route
app.post("/add-student", async (req, res) => {
  try {
    const {
      hostelName,
      roomNumber,
      roomType,
      name,
      rollNumber,
      department,
      email,
      gender,
      phoneNumber,
      address,
      check_in_date,
      check_out_date,
    } = req.body;

    // Check if phoneNumber is valid (not null or empty)
    if (!phoneNumber || phoneNumber.trim() === "") {
      return res.status(400).json({ error: "Phone number is required." });
    }

    // Create new student object
    const newStudent = new Student({
      hostelName,
      roomNumber,
      roomType,
      name,
      rollNumber,
      department,
      email,
      gender,
      phoneNumber,
      address,
      check_in_date,
      check_out_date,
    });

    // Save the student
    await newStudent.save();

    console.log("Saving student: ", newStudent);
    res.status(201).json(newStudent);
  } catch (err) {
    console.log("Error while adding student: ", err);
    res
      .status(500)
      .json({ error: "Failed to add student", message: err.message });
  }
});

app.get("/student-data", async (req, res) => {
  try {
    const response = await Student.find();
    res.json(response);
    // console.log(response)
  } catch (err) {
    console.log(err);
  }
});

app.post("/add-complaint", async (req, res) => {
  try {
    const {
      hostelName,
      roomNumber,
      name,
      rollNumber,
      email,
      about,
      description,
      create_date,
      complete_date,
    } = req.body;

    // // Check if phoneNumber is valid (not null or empty)
    // if (!phoneNumber || phoneNumber.trim() === "") {
    //   return res.status(400).json({ error: "Phone number is required." });
    // }

    // Create new student object
    const status = false;
    const newComplaint = new Complaint({
      hostelName,
      roomNumber,
      name,
      rollNumber,
      email,
      about,
      description,
      status,
      create_date,
      complete_date,
    });

    // Save the student
    console.log(newComplaint);
    await newComplaint.save();
    res.status(201).json(newComplaint);
  } catch (err) {
    console.log("Error while adding complaint: ", err);
    res
      .status(500)
      .json({ error: "Failed to add complaint", message: err.message });
  }
});

app.get("/complaints-data", async (req, res) => {
  console.log("hiii");
  try {
    const response = await Complaint.find();
    res.json(response);
    // console.log(response)
  } catch (err) {
    console.log(err);
  }
});
app.get("/room-data", async (req, res) => {
  try {
    const response = await Rooms.find();
    res.json(response);
    // console.log(response);
  } catch (err) {
    console.log(err);
  }
});
app.post("/update-room", async (req, res) => {
  try {
    const { hostelName, roomNumber} = req.body;
    console.log(hostelName+""+roomNumber)
    const room = await Rooms.findOne({ hostelName, roomNumber});
    console.log(room)
    if (!room) {
      return res.status(404).json("Room not found");
    }

    if (room.roomType > room.occupied_carts) {
      room.occupied_carts = room.occupied_carts + 1;
      console.log(room)
      await room.save();
      return res.status(200).json("room updated successfully");
    } else {
      return res.status(400).json("room is already full");
    }
  } catch (err) {
    return res.status(500).json("internal server error");
  }
});

app.get('/complaints', async(req,res)=>{
  try{
    const response = await Complaint.find();
    return res.json(response)
  }catch(err){
    console.log(err);
  }
})
app.post('/update-complaints', async (req, res) => {
  try {
    const { id } = req.body; 
    console.log("Received ID:", id); // Debug log

    // Validate the format of the ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.error("Invalid ID format");
      return res.status(400).json({ message: "Invalid complaint ID format" });
    }

    const complaint = await Complaint.findById(id);

    if (!complaint) {
      console.error("Complaint not found");
      return res.status(404).json({ message: "Complaint not found" });
    }

    console.log("Complaint before update:", complaint);

    // Toggle the status
    complaint.status = !complaint.status;
    await complaint.save();

    console.log("Complaint after update:", complaint);

    res.status(200).json({ message: "Complaint status updated successfully", complaint });
  } catch (err) {
    console.error("Error updating complaint:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
