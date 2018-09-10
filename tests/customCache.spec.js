const cachios = require('./../src');

describe('cachios.cache', () => {
  test('should call .get with the key', () => {
    const instance = cachios.create();
    instance.cache = {
      get: jest.fn().mockReturnValue(42),
    };

    expect(instance.getCachedValue('answer')).toBe(42);
    expect(instance.cache.get.mock.calls[0][0]).toBe('answer');
  });

  test('should call .set with (key, value, ttl)', () => {
    const instance = cachios.create();
    instance.cache = {
      set: jest.fn(),
    };

    instance.setCachedValue('answer', 42, 10);
    expect(instance.cache.set.mock.calls[0]).toEqual(['answer', 42, 10]);
  });

  test('should resolve with the cached value returned with .get', (done) => {
    const instance = cachios.create();
    instance.cache = {
      get: jest.fn().mockReturnValue(42),
    };

    instance.request({})
    .then((answer) => {
      expect(answer).toBe(42);
    })
    .then(() => done());
  });

  test('should cache the response with .set', (done) => {
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
    instance.cache = {
      get: () => undefined,
      set: jest.fn(),
    };

    instance.request(request)
    .then((resp) => {
      // proper response returned (sanity)
      expect(resp.status).toBe(200);
      expect(resp.data.answer).toBe(42);
    })
    .then(() => {
      // our cache.set func was called with the expected values,
      // including ttl (pulled from config)
      expect(instance.cache.set.mock.calls[0]).toEqual([
        instance.getCacheKey(request),
        instance.getResponseCopy(response),
        request.ttl,
      ]);
    })
    .then(() => done());
  });
});
