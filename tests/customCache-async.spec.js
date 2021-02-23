const cachios = require('./../src');

describe('cachios.cache async', () => {
  test('should resolve with the cached value returned with .get', (done) => {
    const instance = cachios.create();
    instance.cache = {
      get: jest.fn().mockReturnValue(Promise.resolve(42)),
    };

    instance.request({})
    .then((answer) => {
      expect(answer).toBe(42);
    })
    .then(() => done());
  });

  test('should send a request if cached value resolves as undefined', (done) => {
    const response = {
      status: 200,
      data: {
        answer: 42,
      },
    };

    const fakeAxios = {
      request: jest.fn().mockReturnValue(Promise.resolve(response)),
    };

    const instance = cachios.create(fakeAxios);
    instance.cache = {
      get: jest.fn().mockReturnValue(Promise.resolve(undefined)),
    };
    
    instance.request({})
    .then((answer) => {
      expect(answer).toBe(response);
    })
    .then(() => done());
  });

  test('should send a request if cached value rejects', (done) => {
    const response = {
      status: 200,
      data: {
        answer: 42,
      },
    };

    const fakeAxios = {
      request: jest.fn().mockReturnValue(Promise.resolve(response)),
    };

    const instance = cachios.create(fakeAxios);
    instance.cache = {
      get: jest.fn().mockReturnValue(Promise.reject()),
    };
    
    instance.request({})
    .then((answer) => {
      expect(answer).toBe(response);
    })
    .then(() => done());
  });

  test('should cache requests when both .get and .set return promises, cache resolves on undefined', (done) => {
    const cacheData = {};
    
    const customCache = {
      get: (cacheKey) => new Promise((resolve) => resolve(cacheData[cacheKey])),
      set: (cacheKey, value, ttl) => new Promise((resolve) => {
        cacheData[cacheKey] = value;
        resolve();
      }),
    };
    
    const request = {
      ttl: 1337,
    };

    const response = {
      status: 200,
      data: {
        answer: 42,
      },
    };

    const fakeAxios = {
      request: jest.fn().mockReturnValue(Promise.resolve(response)),
    };

    const instance = cachios.create(fakeAxios);
    instance.cache = customCache;

    instance.request(request)
    .then((resp) => {
      // proper response returned (sanity)
      expect(resp.status).toBe(200);
      expect(resp.data.answer).toBe(42);

      // send request again:
      return instance.request(request);
    })
    .then((resp) => {
      // proper response returned (sanity)
      expect(resp.status).toBe(200);
      expect(resp.data.answer).toBe(42);
    })
    .then(() => {
      // ensure only one real request was sent
      expect(fakeAxios.request.mock.calls.length).toBe(1);
    })
    .then(() => done());
  });

  test('should cache requests when both .get and .set return promises, cache rejects on undefined', (done) => {
    const cacheData = {};
    
    const customCache = {
      get: (cacheKey) => new Promise((resolve, reject) => {
        if (cacheData[cacheKey] === undefined) {
          reject(new Error(cacheKey + ' does not exist in cache!'));
        } else {
          resolve(cacheData[cacheKey]);
        }
      }),
      set: (cacheKey, value, ttl) => new Promise((resolve) => {
        cacheData[cacheKey] = value;
        resolve();
      }),
    };
    
    const request = {
      ttl: 1337,
    };

    const response = {
      status: 200,
      data: {
        answer: 42,
      },
    };

    const fakeAxios = {
      request: jest.fn().mockReturnValue(Promise.resolve(response)),
    };

    const instance = cachios.create(fakeAxios);
    instance.cache = customCache;

    instance.request(request)
    .then((resp) => {
      // proper response returned (sanity)
      expect(resp.status).toBe(200);
      expect(resp.data.answer).toBe(42);

      // send request again:
      return instance.request(request);
    })
    .then((resp) => {
      // proper response returned (sanity)
      expect(resp.status).toBe(200);
      expect(resp.data.answer).toBe(42);
    })
    .then(() => {
      // ensure only one real request was sent
      expect(fakeAxios.request.mock.calls.length).toBe(1);
    })
    .then(() => done());
  });
});
