const cachios = require('./../src');

describe('cachios.create', () => {
  test('should return an instance of Cachios', () => {
    const instance = cachios.create();

    expect(instance.constructor.name).toBe('Cachios');
  });
});
