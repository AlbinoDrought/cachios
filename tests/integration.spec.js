import cachios from 'cachios';

const express = require('express');
const axios = require('axios');

const HITS_TO_PERFORM = 100;
const HOST = 'localhost';
const PORT = 10080;
const BASE = `http://${HOST}:${PORT}`;

describe('cachios - integration', () => {
  let server;
  let socket;

  beforeEach((done) => {
    server = express();
    server.all('*', (req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', 'X-Requested-With');
      next();
    });
    socket = server.listen(PORT, done);
  });

  afterEach((done) => {
    if (!server || !socket) {
      return;
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
  ];

  methods.forEach((method) => {
    test(`should work in a somewhat-real environment: ${method}`, () => {
      let hits = 0;

      server[method]('/foo', (req, res) => {
        res.type('text');
        res.send('foobar');
        hits += 1;
      });

      const hitAndCheck = (expectedHits) => cachios[method](`${BASE}/foo`)
      .then((resp) => {
        expect(resp.data).toBe('foobar');
        expect(hits).toBe(expectedHits);
      });

      let promise = Promise.resolve();

      for (let i = 0; i < 100; i += 1) {
        promise = promise.then(() => hitAndCheck(1));
      }

      // clear cache and hit again, expecting our hits counter to increment.
      // (ensures hit counter at least works a little)
      promise = promise
      .then(() => cachios.cache.flushAll())
      .then(() => hitAndCheck(2));

      return promise;
    });
  });
});
