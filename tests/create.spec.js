const assert = require('assert');
const cachios = require('./../src');

describe('cachios.create', function() {
  it('should return an instance of Cachios', function() {
    const instance = cachios.create();

    assert.equal(instance.constructor.name, 'Cachios');
  });
});
