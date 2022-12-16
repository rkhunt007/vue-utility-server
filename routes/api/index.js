const axios = require('axios');
const apiFields = require('../../constants');

const instance = axios.create({
  baseURL:  apiFields.BASE_URL,
});

module.exports = instance;
