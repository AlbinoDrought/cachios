import cachios from './../src';

const assert = require('assert');
const axios = require('axios');
const moxios = require('moxios');

describe('cachios.getResponseCopy', () => {
  beforeEach(function () {
    moxios.install(axios);
  });

  afterEach(function () {
    moxios.uninstall(axios);
  });

  it('should be set by default', () => {
    assert.equal(cachios.getResponseCopy === undefined, false);
  });

  it('should work with an empty response', () => {
    assert.equal(cachios.getResponseCopy({}) === undefined, false);
  });

  it('should be used to copy responses', (done) => {
    const instance = cachios.create(axios);
    const url = 'http://localhost/fake-url';

    instance.getResponseCopy = (resp) => ({
      status: resp.status,
      answer: 'yes', 
    });

    instance.get(url)
    .then((resp) => {
      // this is not a copy
      assert.equal(resp.status, 200);
      assert.equal(resp.data.foo, 'bar');
    })
    .then(() => instance.get(url))
    .then((resp) => {
      // this is a copy
      assert.equal(resp.status, 200);
      assert.equal(resp.answer, 'yes');
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
