const globalCachios = require('./../src');
const globalAxios = require('axios');

const express = require('express');
const axios = require('axios');

const HITS_TO_PERFORM = 25;
const SIMULTANEOUS_HITS = 4;
const HOST = '127.0.0.1';
const PORT = 11888;
const BASE = `http://${HOST}:${PORT}`;

describe('cachios - integration', () => {
  let server;
  let socket;
  let cachios;

  beforeEach((done) => {
    server = express();
    server.all('*', (req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', 'X-Requested-With');
      next();
    });
    socket = server.listen(PORT, done);
    cachios = globalCachios.create(globalAxios);
  });

  afterEach((done) => {
    if (!server || !socket) {
      return done();
    }

    socket.close(done);
    server = undefined;
    socket = undefined;
  });

  const methods = [
    'get',
    'post',
    'put',
    'patch',
    'delete',
  ];

  const makeHitCounter = (instance, method, base) => {
    const hitCounter = {
      hits: 0,
      method,
      endpoint: '/foo',
      body: 'foobar',
    };

    hitCounter.url = () => `${base}${hitCounter.endpoint}`;

    instance[method](hitCounter.endpoint, (req, res) => {
      res.type('text');
      res.send(hitCounter.body);
      hitCounter.hits += 1;
    });

    return hitCounter;
  };

  // hit our test url and check if we hit it or if it was returned from cache
  const hitAndCheck = (hitCounter, cachiosInstance, expectedHits) => {
    const url = hitCounter.url();
    return Promise.resolve()
      .then(() => cachiosInstance[hitCounter.method](url))
      .then((resp) => {
        // make sure we receive the expected text
        expect(resp.data).toBe(hitCounter.body);
        // make sure our hit counter matches up with our expected amount of hits
        expect(hitCounter.hits).toBe(expectedHits);
      });
  };

  methods.forEach((method) => {
    test(`should work in a somewhat-real environment: ${method}`, () => {
      const hitCounter = makeHitCounter(server, method, BASE);

      let promise = Promise.resolve();

      for (let i = 0; i < HITS_TO_PERFORM; i += 1) {
        promise = promise.then(() => hitAndCheck(hitCounter, cachios, 1));
      }

      // clear cache and hit again, expecting our hits counter to increment.
      // (ensures hit counter at least works a little)
      promise = promise
      .then(() => cachios.cache.flushAll())
      .then(() => hitAndCheck(hitCounter, cachios, 2));

      return promise;
    });

    test(`should bypass cache when \`force\` is set: ${method}`, () => {
      const hitCounter = makeHitCounter(server, method, BASE);

      let promise = Promise.resolve();

      for (let i = 0; i < HITS_TO_PERFORM; i += 1) {
        promise = promise
        .then(() => cachios.request({
          method: method,
          url: hitCounter.url(),
        })).then(() => {
          expect(hitCounter.hits).toBe(1);
        });
      }

      // set force = true to bypass cache
      promise = promise
      .then(() => cachios.request({
        method: method,
        url: hitCounter.url(),
        force: true,
      })).then(() => {
        expect(hitCounter.hits).toBe(2);
      });

      // unforced request after forced request should still receive cached response
      promise = promise
      .then(() => cachios.request({
        method: method,
        url: hitCounter.url(),
      })).then(() => {
        expect(hitCounter.hits).toBe(2);
      });

      return promise;
    });

    /*
      # Deduplicate simultaneous requests #44

      Hi
      Currently, if multiple axios requests are triggered on the same resource in the same event loop, it will trigger multiple http requests
      It would be great if that could be deduplicated
    */
    test(`should work when sending simultaneous requests: ${method}`, () => {
      const hitCounter = makeHitCounter(server, method, BASE);

      let promise = Promise.resolve();

      for (let i = 0; i < HITS_TO_PERFORM; i += 1) {
        // send simultaneous hits
        const hits = [];
        for (let o = 0; o < SIMULTANEOUS_HITS; o += 1) {
          hits.push(hitAndCheck(hitCounter, cachios, 1));
        }
        promise = promise.then(() => Promise.all(hits));
      }

      // clear cache and hit again, expecting our hits counter to increment.
      // (ensures hit counter at least works a little)
      promise = promise
      .then(() => cachios.cache.flushAll())
      .then(() => hitAndCheck(hitCounter, cachios, 2));

      return promise;
    });
  });
});
