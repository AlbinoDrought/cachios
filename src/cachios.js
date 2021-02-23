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
  // requests that have been fired but have not yet been completed
  this.stagingPromises = {};

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
  return handleRequest(this, config);
};

function handleRequest(instance, config, force) {
  var ttl = config.ttl;
  var force = force || config.force || false;
  var cacheablePromise = !config.cancelToken; // refuse to cache cancellable requests until their promise has resolved
  var cacheKey = instance.getCacheKey(config);

  // if we're not forcing this request to ignore cache,
  // check for a cached value and return it immediately if found
  if (force !== true) {
    var cachedValue = instance.getCachedValue(cacheKey);
    if (cachedValue !== undefined) {
      return Promise.resolve(cachedValue);
    }
  }

  // if we find a staging promise (a request that has not yet completed, so it is not yet in cache),
  // return it.
  if (cacheablePromise && instance.stagingPromises[cacheKey]) {
    return instance.stagingPromises[cacheKey];
  }

  // otherwise, send a real request and cache the value for later
  var pendingPromise = instance.axiosInstance.request(config);

  // store the promise in stagingPromises so it can be used before completing
  // we don't store it in the cache immediately because:
  // - we don't want it in the cache if the request fails
  // - our cache backend may not support promises
  if (cacheablePromise) {
    instance.stagingPromises[cacheKey] = pendingPromise;
  }

  // once the request successfully completes, store it in cache
  pendingPromise.then(function (resp) {
    instance.setCachedValue(cacheKey, instance.getResponseCopy(resp), ttl);
  }).catch(function () {}).then(function () {
    // always delete the staging promise once the request is complete
    // (finished or failed)
    delete instance.stagingPromises[cacheKey];
  });

  // return the original promise
  return pendingPromise;
}

extendPrototype(Cachios.prototype);

module.exports = Cachios;
