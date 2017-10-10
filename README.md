# Cachios

[![Greenkeeper badge](https://badges.greenkeeper.io/AlbinoDrought/cachios.svg)](https://greenkeeper.io/)
[![Dependency Status](https://david-dm.org/albinodrought/cachios.svg)](https://david-dm.org/albinodrought/cachios)
[![npm version](https://badge.fury.io/js/cachios.svg)](https://badge.fury.io/js/cachios)
[![Build Status](https://travis-ci.org/AlbinoDrought/cachios.svg?branch=master)](https://travis-ci.org/AlbinoDrought/cachios)
[![Coverage Status](https://coveralls.io/repos/github/AlbinoDrought/cachios/badge.svg?branch=master)](https://coveralls.io/github/AlbinoDrought/cachios?branch=master)

[![NPM](https://nodei.co/npm/cachios.png)](https://nodei.co/npm/cachios/)

A simple `axios` cache wrapper using `node-cache`.

---

Cachios is meant to be a replacement for the following pattern:

```js
const axios = require('axios');

const resources = {};

function getResource(id) {
  if (!resources[id]) {
    // actually retrieve the resource
    return axios.get(`/api/thing/${id}`).then((resp) => {
      // store the resource
      resources[id] = resp.data;
      return resp.data;
    });
  } else {
    // return the resource we already have
    return Promise.resolve(resources[id]);
  }
}
```

With Cachios, this is replaced with:

```js
const cachios = require('cachios');

function getResource(id) {
  return cachios.get(`/api/thing/${id}`).then((resp) => {
    return resp.data;
  });
}
```

The following `axios` methods are supported:

* request
* get
* delete
* head
* options
* post
* put
* patch

The entire response is not cached, and is instead trimmed down (by default) to `status` and `data`. To configure this, see ["Custom Response Copier"](#custom-response-copier).

## Installation

`npm install --save cachios`

## Examples

Basic:

```js
const cachios = require('cachios');

cachios.get('https://jsonplaceholder.typicode.com/posts/1', {
  ttl: 300 /* seconds */,
}).then(console.log);

```

Custom axios client:

```js
// your normal, non-cached axios instance that is already setup.
import axios from './configured-axios';

const cachios = require('cachios');
const cachiosInstance = cachios.create(axios);

const postData = {/* your postdata here */};

cachiosInstance.post('/posts/1', postData, {
  ttl: 30, // persist 30 seconds
}).then((resp) => {
  console.log(resp.status);

  const data = resp.data;
  console.log(data.title);
  console.log(data.body);
});

```

Multiple cached GET requests: [Runkit](https://runkit.com/albinodrought/cachios-get-example)

Multiple cached GET requests with different query parameters: [Runkit](https://runkit.com/albinodrought/cachios-get-params-example)

## Configuration

### TTL

To set the cache TTL, pass it in with your request config:

```js
const cachios = require('cachios');

cachios.get('url', {
  ttl: /* time to live in seconds */,
});

const postData = {};
cachios.post('url', postData, {
  headers: /* your custom headers */
  ...
  ttl: 60, // persist this result for 60 seconds
});
```

### Custom Axios Instance

Cachios also supports using a pre-configured `axios` instance:

```js
const cachios = require('cachios');
const axios = require('axios');

const axiosInstance = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
});

// all requests will now use this axios instance
const cachiosInstance = cachios.create(axiosInstance);
```

### Custom Cache Configuration

Internally, Cachios uses `node-cache` with sane defaults. To configure it yourself, pass it during `cachios.create`:

```js
const cachios = require('cachios');
const axios = require('axios');

// configure `node-cache` to keep cache forever!
const cachiosInstance = cachios.create(axios, {
  stdTTL: 0,
  checkperiod: 0,
});
```

### Alternative Cache Implementation

Don't want to use `node-cache`? The `.cache` property can be overridden.

`cachios` expects the cache implementation to work as follows:

```js
cachios.cache = {
  /**
  cacheKey: string

  if a value has been set for this `cacheKey`, return it.
  otherwise, return a falsey value (undefined, false, null)
  */
  get(cacheKey),

  /**
  cacheKey: string
  cacheValue: mixed
  ttl: number|undefined

  store the value `cacheValue` under `cacheKey` for `ttl` seconds.
  if `ttl` is not set, it is assumed the value is stored forever.
  */
  set(cacheKey, cacheValue, ttl),
}
```

Example using `lru-cache`:

```js
const cachios = require('cachios');
const LRU  = require('lru-cache');

cachios.cache = LRU(500);

cachios.get('http://example.com/') // not cached
.then(() => cachios.get('http://example.com/')); // cached
.then(() => {
  console.log(cachios.cache.itemCount); // 1 item in cache - the first request
});
```

### Custom Response Copier

By default, Cachios uses the following function to trim responses:

```js
function defaultResponseCopier(response) {
  return {
    status: response.status,
    data: response.data,
  };
}
```

This was originally implemented because of errors during response storage.

To change what is saved, set the `getResponseCopy` property of your Cachios instance:

```js
const cachios = require('cachios');

cachios.getResponseCopy = function (response) {
  return {
    status: response.status,
    statusText: response.statusText,
    data: response.data,
  };
};
```

### Custom Cache Identifier

By default, Cachios uses the following function to create a unique cache identifier:

```js
function defaultCacheIdentifer(config) {
  return {
    method: config.method,
    url: config.url,
    params: config.params,
    data: config.data,
  };
}
```

To override this, set the `getCacheIdentifier` property of your Cachios instance:

```js
const cachios = require('cachios');

cachios.getCacheIdentifier = function (config) {
  return {
    method: config.method,
    url: config.url,
    params: config.params,
    data: config.data,
    headers: config.headers,
  };
};
```

## License

[MIT](LICENSE.md)
