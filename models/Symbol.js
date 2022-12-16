const mongoose = require("mongoose");
const { Schema } = mongoose;

const symbolSchema = new Schema({
  symbol: {
    type: String,
    required: true,
  },
  currentPrice: {
    type: Number,
    required: true,
  },
  monthLow: {
    type: Number,
    required: true,
  },
  _52weekLow: {
    type: Number,
    required: true,
  },
  priceDiff: {
    type: Number,
    required: true,
  },
  pricePerc: {
    type: Number,
    required: true,
  },
  _52weekDiff: {
    type: Number,
    required: true,
  },
  _52weekPerc: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Symbol = mongoose.model('symbol', symbolSchema);

module.exports = Symbol;
