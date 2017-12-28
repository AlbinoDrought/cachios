import cachios from './../src';

const assert = require('assert');

describe('cachios.create', () => {
  test('should return an instance of Cachios', () => {
    const instance = cachios.create();

    assert.equal(instance.constructor.name, 'Cachios');
  });
});
