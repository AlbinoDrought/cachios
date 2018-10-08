var axios = require('axios');
var Cachios = require('./cachios');

var instance = new Cachios(axios);

// allow for similar axios syntax
instance.create = function create(axiosInstance, nodeCacheConf) {
  return new Cachios(axiosInstance, nodeCacheConf);
};

module.exports = instance;
