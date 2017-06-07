const assert = require('assert');
const axios = require('axios');
const moxios = require('moxios');
const cachios = require('./../src');

const datalessMethods = [
  'delete',
  'get',
  'head',
  'options',
];

const dataMethods = [
  'post',
  'put',
  'patch',
];

describe('cachios', function () {
  beforeEach(function () {
    moxios.install(axios);
  });

  afterEach(function () {
    moxios.uninstall(axios);
  });

  datalessMethods.concat(dataMethods).forEach((method) => {
    describe('helper method ' + method, function() {
      it('should exist', function() {
        assert.ok(method in cachios);
      });
    });
  });

  datalessMethods.forEach((method) => {
    describe('helper method ' + method, function() {
      it('should work with default options', function(done) {
        const cachiosInstance = cachios.create(axios);
        const url = 'http://localhost/fake-url';

        cachiosInstance[method](url).then(() => { done(); });

        moxios.wait(function() {
          moxios.requests.mostRecent().respondWith({
            status: 200,
            response: {},
          });
        });
      });

      it('should be cached', function (done) {
        const cachiosInstance = cachios.create(axios);
        const time = Date.now();
        const url = 'http://localhost/fake-url';

        let promise = cachiosInstance[method](url, {
          ttl: 60,
        });

        moxios.wait(function() {
          let request = moxios.requests.mostRecent();
          request.respondWith({
            status: 200,
            response: {
              time: time,
            }
          });

          for(let i = 0; i < 10; i += 1) {
            promise = promise.then(() => cachiosInstance[method](url, {
              ttl: 60,
            }).then((resp) => {
              assert.equal(resp.data.time, time);
            }));
          }

          promise.then(done);
        });
      });
    });
  });

  dataMethods.forEach((method) => {
    describe('helper method ' + method, function() {
      it('should work with default options', function(done) {
        const cachiosInstance = cachios.create(axios);
        const url = 'http://localhost/fake-url';
        const postData = {
          stuff: 'yes',
        };

        cachiosInstance[method](url, postData).then(() => { done(); });

        moxios.wait(function() {
          moxios.requests.mostRecent().respondWith({
            status: 200,
            response: {},
          });
        });
      });

      it('should be cached', function (done) {
        const cachiosInstance = cachios.create(axios);
        const time = Date.now();
        const url = 'http://localhost/fake-url';
        const postData = {
          stuff: 'yes',
        };

        let promise = cachiosInstance[method](url, postData, {
          ttl: 60,
        });

        moxios.wait(function() {
          let request = moxios.requests.mostRecent();
          request.respondWith({
            status: 200,
            response: {
              time: time,
            }
          });

          for(let i = 0; i < 10; i += 1) {
            promise = promise.then(() => cachiosInstance[method](url, postData, {
              ttl: 60,
            }).then((resp) => {
              assert.equal(resp.data.time, time);
            }));
          }

          promise.then(done);
        });
      });
    });

  });
});
