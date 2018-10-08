var hash = require('object-hash');
var NodeCache = require('node-cache');
var extendPrototype = require('./extendPrototype');

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

Cachios.prototype.getCacheKey = function (config) {
  return hash(this.getCacheIdentifier(config));
};

Cachios.prototype.getCachedValue = function (cacheKey) {
  return this.cache.get(cacheKey);
};

Cachios.prototype.setCachedValue = function (cacheKey, value, ttl) {
  return this.cache.set(cacheKey, value, ttl);
};

Cachios.prototype.request = function request(config) {
  var ttl = config.ttl;
  var cacheKey = this.getCacheKey(config);
  var cachedValue = this.getCachedValue(cacheKey);

  // if we find a cached value, return it immediately
  if (cachedValue !== undefined) {
    return Promise.resolve(cachedValue);
  }

  // otherwise, send a real request and cache the value for later
  var me = this;
  return this.axiosInstance.request(config).then(function (resp) {
    me.setCachedValue(cacheKey, me.getResponseCopy(resp), ttl);
    return resp;
  });
};

extendPrototype(Cachios.prototype);

module.exports = Cachios;
