const express = require("express");
const router = express.Router();
const Symbol = require("../../models/Symbol");
const {compareAsc, format} =  require('date-fns');

// @route   GET api/fetchAll
// @access  Public
router.get("/", async (req, res) => {
  try {
    let data = await Symbol.find({})
    console.log(format(new Date(), 'yyyy-MM-dd HH:mm'), 'fetchAll success')
    res.status(200).json(data)
  } catch (error) {
    console.log('load error', error);
    res.status(500).json("Server Error");
  }
});

module.exports = router;
