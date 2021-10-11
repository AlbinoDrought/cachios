const cachios = require('./../src');

const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');

describe('cachios cancelling', () => {
  let mock;

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
  });

  test('nothing should explode if a request is cancelled', async () => {
    jest.useFakeTimers();

    const cachiosInstance = cachios.create(axios);
    const url = 'http://localhost/fake-url';

    const CancelToken = axios.CancelToken;
    let source = CancelToken.source();

    const cachiosPromise = cachiosInstance.get(url, {
      cancelToken: source.token,
    });
    
    source.cancel('test');

    try {
      await cachiosPromise;
      // this should never happen!
      throw new Error('Promise should not successfully resolve, we cancelled it!');
    } catch (ex) {
      // we should receive the normal axios cancel exception here
      // (and no "null" issues)
      expect(ex.message).toBe('test');
    }

    source = CancelToken.source();

    mock.onGet(url).reply(200);

    try {
      const resp = await cachiosInstance.get(url, {
        cancelToken: source.token,
      });
      expect(resp.status).toBe(200);
    } catch (ex) {
      throw new Error(`The cancelled request was unexpectedly cached, reproducing https://github.com/AlbinoDrought/cachios/issues/55`);
    }
  });
});
