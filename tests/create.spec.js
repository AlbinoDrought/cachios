import cachios from './../src';

const assert = require('assert');

describe('cachios.create', function() {
  it('should return an instance of Cachios', function() {
    const instance = cachios.create();

    assert.equal(instance.constructor.name, 'Cachios');
  });
});
