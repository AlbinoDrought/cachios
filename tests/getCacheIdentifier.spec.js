import cachios from './../src';

const assert = require('assert');
const axios = require('axios');
const moxios = require('moxios');

describe('cachios.getCacheIdentifier', () => {
  beforeEach(function () {
    moxios.install(axios);
  });

  afterEach(function () {
    moxios.uninstall(axios);
  });

  it('should be set by default', () => {
    assert.equal(cachios.getCacheIdentifier === undefined, false);
  });

  it('should work with an empty config', () => {
    assert.equal(cachios.getCacheIdentifier({}) === undefined, false);
  });

  it('should be used to identify cache', (done) => {
    const instance = cachios.create(axios);
    const url = 'http://localhost/fake-url';
    const otherUrl = 'http://localhost/even-faker-url';

    // always return the same identifier
    instance.getCacheIdentifier = () => 42;

    // this is a bit of an anti-pattern here:
    // we only respond to the first request with moxios.
    // so, if this was not working (and a second request was attempted),
    // the test would timeout.
    instance.get(url)
    .then(() => instance.get(otherUrl))
    .then(() => done());

    moxios.wait(() => {
      moxios.requests.mostRecent()
        .respondWith({
          status: 200,
          response: {
            foo: 'bar',
          },
        });
    });
  });
});
