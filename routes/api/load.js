const express = require("express");
const router = express.Router();
const axios = require('../api');
const apiFields = require('../../constants');
const Symbol = require("../../models/Symbol");
const {compareAsc, format} =  require('date-fns');

// @route   GET api/load
// @access  Public
router.get("/", async (req, res) => {
  try {

    const symbol = req.query.symbol;
    let data = await loadData(symbol)
    // let data = { message: symbol}
    console.log('api success')
    res.status(200).json({ message: data.message, ...data.payload})

  } catch (error) {
    console.log('load error', error);
    res.status(500).json("Server Error");
  }
});


async function loadData(symbol) {
  try {
    let data = {};
    const res1 = await axios({
      method: 'get',
      url: `/query?function=${apiFields.TIME_SERIES_DAILY_ADJUSTED}&symbol=${symbol}&apikey=${apiFields.API_KEY}`,
    })

    const res2 = await axios({
      method: 'get',
      url: `/query?function=${apiFields.OVERVIEW}&symbol=${symbol}&apikey=${apiFields.API_KEY}`,
    })

    if (res1.status !== 200 || res2.status !== 200) {
      throw Error('Something went wrong while loading data')
    }

    data = { ...res1.data, ...res2.data }

    let monthKeys = Object.keys(data['Time Series (Daily)']);
    monthKeys = monthKeys.splice(0, 30);

    let monthLow, currentPrice;

    for (let i = 0; i < monthKeys.length; i++) {
      let dayKey = monthKeys[i];

      if (i == 0) {
        currentPrice = Number(data['Time Series (Daily)'][dayKey]["4. close"]);
      }

      if (!monthLow) {
        monthLow = Number(data['Time Series (Daily)'][dayKey]['4. close']);
      } else if (monthLow > Number(data['Time Series (Daily)'][dayKey]['4. close'])) {
        monthLow = Number(data['Time Series (Daily)'][dayKey]['4. close']);
      }
    }

   let _52weekLow = data['52WeekLow'];
   let priceDiff = (currentPrice - monthLow).toFixed(2)
   let pricePerc = ((100 * priceDiff) / currentPrice).toFixed(2)
   let _52weekDiff = (currentPrice - _52weekLow).toFixed(2)
   let _52weekPerc = ((100 * _52weekDiff) / currentPrice).toFixed(2)

    let symbolObj = await Symbol.findOne({ symbol });
    if (!symbolObj) {
      symbolObj = new Symbol({ symbol, monthLow, currentPrice, _52weekLow, priceDiff, pricePerc, _52weekDiff, _52weekPerc });
    } else {
      const symbolFields = {};
      symbolFields.monthLow = monthLow;
      symbolFields.currentPrice = currentPrice;
      symbolFields._52weekLow = _52weekLow;
      symbolFields.priceDiff = priceDiff;
      symbolFields.pricePerc = pricePerc;
      symbolFields._52weekDiff = _52weekDiff;
      symbolFields._52weekPerc = _52weekPerc;
      symbolFields.date = new Date();

      symbolObj = await Symbol.findOneAndUpdate(
        { symbol },
        { $set: symbolFields },
        { new: true, setDefaultsOnInsert: true }
      );
      console.log(format(new Date(), 'yyyy-MM-dd HH:mm'), `symbol updated for ${symbol}`)
      return {message: 'symbol updated', payload: symbolObj}
    }

    await symbolObj.save();
    console.log(format(new Date(), 'yyyy-MM-dd HH:mm'), `symbol added for ${symbol}`)
    return {message: 'symbol added', payload: symbolObj}

  } catch (error) {
    console.log('load data error', error);
    res.status(500).send("load data error", error);
  }

}

module.exports = router;
