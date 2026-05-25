// Simple request logger - you can replace with winston for production
const morgan = require('morgan');

const logger = morgan(':remote-addr :method :url :status :res[content-length] - :response-time ms');

module.exports = logger;
