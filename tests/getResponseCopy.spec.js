const cachios = require('./../src');

const axios = require('axios');
const moxios = require('moxios');

describe('cachios.getResponseCopy', () => {
  beforeEach(() => {
    moxios.install(axios);
  });

  afterEach(() => {
    moxios.uninstall(axios);
  });

  test('should be set by default', () => {
    expect(cachios.getResponseCopy).toBeDefined();
  });

  test('should work with an empty response', () => {
    expect(cachios.getResponseCopy({})).toBeDefined();
  });

  test('should be used to copy responses', (done) => {
    const instance = cachios.create(axios);
    const url = 'http://localhost/fake-url';

    instance.getResponseCopy = (resp) => ({
      status: resp.status,
      answer: 'yes',
    });

    instance.get(url)
    .then((resp) => {
      // this is not a copy
      expect(resp.status).toBe(200);
      expect(resp.data.foo).toBe('bar');
    })
    .then(() => instance.get(url))
    .then((resp) => {
      // this is a copy
      expect(resp.status).toBe(200);
      expect(resp.answer).toBe('yes');
    })
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
