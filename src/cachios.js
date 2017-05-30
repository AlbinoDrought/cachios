const hash = require('object-hash');
const NodeCache = require('node-cache');

const extendPrototype = require('./extendPrototype');

function defaultCacheIdentifer(config) {
  return {
    method: config.method,
    url: config.url,
    params: config.params,
    data: config.data,
  };
}

function defaultResponseCopier(response) {
  return {
    status: response.status,
    data: response.data,
  };
}

function Cachios(axiosInstance, nodeCacheConf) {
  this.axiosInstance = axiosInstance;
  this.cache = new NodeCache(nodeCacheConf || {
    stdTTL: 30,
    checkperiod: 120,
  });

  this.getCacheIdentifier = defaultCacheIdentifer;
  this.getResponseCopy = defaultResponseCopier;
}

Cachios.prototype.getCacheKey = function getCacheKey(config) {
  return hash(this.getCacheIdentifier(config));
};

Cachios.prototype.getCachedValue = function getCachedValue(cacheKey) {
  return this.cache.get(cacheKey);
};

Cachios.prototype.setCachedValue = function setCachedValue(cacheKey, value, ttl) {
  return this.cache.set(cacheKey, value, ttl);
};

Cachios.prototype.request = function request(config) {
  const ttl = config.ttl;

  const cacheKey = this.getCacheKey(config);
  const cachedValue = this.getCachedValue(cacheKey);

  let promise;

  if (cachedValue === undefined) {
    promise = this.axiosInstance.request(config).then((resp) => {
      this.setCachedValue(cacheKey, this.getResponseCopy(resp), ttl);
      return resp;
    });
  } else {
    promise = Promise.resolve(cachedValue);
  }

  return promise;
};

extendPrototype(Cachios.prototype);

module.exports = Cachios;
