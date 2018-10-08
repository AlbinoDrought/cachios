const cachios = require('./../src');

const axios = require('axios');
const moxios = require('moxios');

describe('cachios.getCacheIdentifier', () => {
  beforeEach(() => {
    moxios.install(axios);
  });

  afterEach(() => {
    moxios.uninstall(axios);
  });

  test('should be set by default', () => {
    expect(cachios.getCacheIdentifier === undefined).toBe(false);
  });

  test('should work with an empty config', () => {
    expect(cachios.getCacheIdentifier({}) === undefined).toBe(false);
  });

  test('should be used to identify cache', (done) => {
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
