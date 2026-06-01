const mongoose = require("mongoose");

const fighter_schema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    rank: {
      type: String,
      required: true,
    },
    unit: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["активний", "поранений", "відпустка", "полон", "зниклий безвісти"],
      default: "активний",
    },
    birthDate: {
      type: Date,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
      default: null,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Fighter", fighter_schema);
