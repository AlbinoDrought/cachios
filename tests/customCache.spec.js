import cachios from './../src';

const assert = require('assert');
const sinon = require('sinon');

describe('cachios.cache', function () {
  it('should call .get with the key', () => {
    const instance = cachios.create();
    instance.cache = {
      get: sinon.stub().returns(42),
    };

    assert.equal(instance.getCachedValue('answer'), 42);
    assert.equal(instance.cache.get.calledWith('answer'), true);
  });

  it('should call .set with (key, value, ttl)', () => {
    const instance = cachios.create();
    instance.cache = {
      set: sinon.stub(),
    };

    instance.setCachedValue('answer', 42, 10);
    assert.equal(instance.cache.set.calledWith('answer', 42, 10), true);
  });

  it('should resolve with the cached value returned with .get', (done) => {
    const instance = cachios.create();
    instance.cache = {
      get: sinon.stub().returns(42),
    };

    instance.request({})
    .then((answer) => {
      assert.equal(answer, 42);
    })
    .then(() => done());
  });

  it('should cache the response with .set', (done) => {
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
      request: sinon.stub().resolves(response),
    };

    const instance = cachios.create(fakeAxios);
    instance.cache = {
      get: () => undefined,
      set: sinon.stub(),
    };

    instance.request(request)
    .then((resp) => {
      // proper response returned (sanity)
      assert.equal(resp.status, 200);
      assert.equal(resp.data.answer, 42);
    })
    .then(() => {
      // our cache.set func was called with the expected values,
      // including ttl (pulled from config)
      assert.equal(instance.cache.set.calledWith(
        instance.getCacheKey(request),
        instance.getResponseCopy(response),
        request.ttl,
      ), true);
    })
    .then(() => done());
  });
});
