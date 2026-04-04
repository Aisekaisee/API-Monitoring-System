import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    unique: true,
    validate: {
      validator: function (userName) {
        return /^[a-zA-Z0-9]+$/.test(userName); // Alphanumeric only
      },
      message: "Please enter a valid username (alphanumeric only)",
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (email) {
        return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email); // Email format
      },
      message: "Please enter a valid email address",
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    validator: {
      validator: function (password) {
        return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(password); // Minimum 6 characters, at least one letter and one number
      },
      message:
        "Password must be at least 6 characters long and contain at least one letter and one number",
    }, 
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);

export default User;
