const cachios = require('./../src');

const axios = require('axios');
const moxios = require('moxios');

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

describe('cachios', () => {
  beforeEach(() => {
    moxios.install(axios);
  });

  afterEach(() => {
    moxios.uninstall(axios);
  });

  datalessMethods.concat(dataMethods).forEach((method) => {
    describe('helper method ' + method, () => {
      test('should exist', () => {
        expect(cachios[method]).toBeDefined();
      });
    });
  });

  datalessMethods.forEach((method) => {
    describe('helper method ' + method, () => {
      test('should work with default options', done => {
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

      test('should be cached', done => {
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
              expect(resp.data.time).toBe(time);
            }));
          }

          promise.then(done);
        });
      });
    });
  });

  dataMethods.forEach((method) => {
    describe('helper method ' + method, () => {
      test('should work with default options', done => {
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

      test('should be cached', done => {
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
              expect(resp.data.time).toBe(time);
            }));
          }

          promise.then(done);
        });
      });
    });

  });
});
