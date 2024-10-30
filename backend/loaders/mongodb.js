const mongoose = require('mongoose');
const { MONGO_CONN_STRING } = require('../configs');

mongoose.connect(MONGO_CONN_STRING);

module.exports = {
    mongoose
}