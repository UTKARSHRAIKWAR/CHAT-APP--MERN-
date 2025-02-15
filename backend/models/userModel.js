const mongoose = require("mongoose");
const { CgPassword } = require("react-icons/cg");

const userModel = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    pic: {
      type: String,
      required: true,
      default: "https://cdn-icons-png.flaticon.com/512/6388/6388003.png",
    },
  },
  { timeStamps: true }
);

const User = mongoose.model("User", userModel);

module.exports = User;
