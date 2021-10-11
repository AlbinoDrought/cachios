const cachios = require('./../src');

const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');

describe('cachios.getCacheIdentifier', () => {
  let mock;

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
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

    mock.onGet(url).replyOnce(200);

    // always return the same identifier
    instance.getCacheIdentifier = () => 42;

    // we only respond to the first request with the mock adapter.
    // so, if caching was not working and a second request was attempted,
    // the test would timeout.
    instance.get(url)
      .then(() => instance.get(otherUrl))
      .then(() => done());
  });
});
