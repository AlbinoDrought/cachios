const cachios = require('./../src');

const axios = require('axios');
const moxios = require('moxios');

describe('cachios cancelling', () => {
  beforeEach(() => {
    moxios.install(axios);
  });

  afterEach(() => {
    moxios.uninstall(axios);
  });

  test('nothing should explode if a request is cancelled', (done) => {
    jest.useFakeTimers();

    const cachiosInstance = cachios.create(axios);
    const url = 'http://localhost/fake-url';

    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    cachiosInstance.get(url, {
      cancelToken: source.token,
    }).then((resp) => {
      // this should never happen!
      expect(false).toBe(true);
      done();
    }).catch((ex) => {
      // we should receive the normal axios cancel exception here
      // (and no "null" issues)
      expect(ex.message).toBe('test');
      done();
    });

    setTimeout(() => {
      source.cancel('test');
    }, 10);
    jest.runOnlyPendingTimers();

    // intentionally never resolve moxios request
    // we want to cancel the request before it finishes.
  });
});
