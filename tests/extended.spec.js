const cachios = require('./../src');

const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');

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
  let mock;

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
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

        mock.onAny(url).replyOnce(200);
        cachiosInstance[method](url).then(() => { done(); });
      });

      test('should be cached', done => {
        const cachiosInstance = cachios.create(axios);
        const time = Date.now();
        const url = 'http://localhost/fake-url';

        mock.onAny(url).replyOnce(200, {
          time: time,
        });

        let promise = cachiosInstance[method](url, {
          ttl: 60,
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

  dataMethods.forEach((method) => {
    describe('helper method ' + method, () => {
      test('should work with default options', done => {
        const cachiosInstance = cachios.create(axios);
        const url = 'http://localhost/fake-url';
        const postData = {
          stuff: 'yes',
        };

        mock.onAny(url).replyOnce(200);
        cachiosInstance[method](url, postData).then(() => { done(); });
      });

      test('should be cached', done => {
        const cachiosInstance = cachios.create(axios);
        const time = Date.now();
        const url = 'http://localhost/fake-url';
        const postData = {
          stuff: 'yes',
        };

        mock.onAny(url).replyOnce(200, {
          time: time,
        });

        let promise = cachiosInstance[method](url, postData, {
          ttl: 60,
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
