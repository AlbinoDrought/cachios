import Cachios from './cachios';

const axios = require('axios');

const instance = new Cachios(axios);

// allow for similar axios syntax
instance.create = function create(axiosInstance, nodeCacheConf) {
  return new Cachios(axiosInstance, nodeCacheConf);
};

export default instance;
