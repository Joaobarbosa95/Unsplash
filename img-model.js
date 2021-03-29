const mongoose = require("mongoose");
const { isURL } = require("validator");

const schema = new mongoose.Schema({
  url: {
    type: String,
    validate: {
      validator: function (v) {
        return isURL(v);
      },
      message: () => "Must be a Url type string.",
    },
    required: [true, "Url required!"],
  },

  label: {
    type: String,
    maxLength: [60, "Labels must have a maximum of 60 characters."],
    required: true,
    trim: true,
  },
});

const Image = mongoose.model("Image", schema);

module.exports = Image;
