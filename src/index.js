const axios = require('axios');

const Cachios = require('./cachios');

const instance = new Cachios(axios);

// allow for similar axios syntax
instance.create = function create(axiosInstance, nodeCacheConf) {
  return new Cachios(axiosInstance. nodeCacheConf);
}

module.exports = instance;
module.exports.default = instance;
