const { default: axios } = require('axios');
const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
require('dotenv').config();

const connectDB = require('./config/db');

const app = express();

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

// Connect DB
connect();

app.use(cors());

async function connect() {
    await connectDB();
    // init();
}


app.get('/', (req, res) => res.send(`Auth Server Running ${process.env.PORT || 5000}`));
app.use('/api/load', require('./routes/api/load'));
app.use('/api/fetchAll', require('./routes/api/fetchAll'));

async function init() {
    console.log('##### begin fetching data ###########')
    const symbols = ['AMZN', 'NFLX', 'AAPL', 'SHOP', 'META'];
    for (let i = 0; i < symbols.length; i++) {
        const symbol = symbols[i];
        console.log('calling api for symbol', symbol);
        await axios.get(`http://localhost:5000/api/load?symbol=${symbol}`);
        await delay(60000)
    }
    console.log('##### end fetching data ###########')
}

cron.schedule('59 23 * * *', function () {
    init();
}, {
    scheduled: true,
    timezone: "Canada/Eastern"
});



const PORT = process.env.PORT || 5000;
app.listen(PORT);