/**
 * @jest-environment jsdom
 */
const cachios = require('./../src');

const axios = require('axios');
const hash = require('object-hash');

describe('cachios.getReplaced', () => {
  test('should be set by default', () => {
    expect(cachios.getReplaced).toBeDefined();
  });

  test('should not modify common values', () => {
    [
      { foo: 'bar' },
      1234,
      'Melon',
      1.234,
      null,
      undefined,
    ].forEach((thing) => {
      expect(cachios.getReplaced(thing)).toEqual(thing);
    });
  });

  test('should be used when creating cache keys', () => {
    const instance = cachios.create(axios);

    instance.getReplaced = (thing) => {
      console.log(thing);
      if (thing === 'bar') {
        return 'baz';
      }
      return thing;
    };

    const expected = hash({
      method: 'GET',
      url: '/something',
      params: {
        foo: 'baz',
      },
      data: {
        stuff: [
          { foo: 'baz' },
        ],
      },
    });

    const actual = instance.getCacheKey({
      method: 'GET',
      url: '/something',
      params: {
        foo: 'bar',
      },
      data: {
        stuff: [
          { foo: 'bar' },
        ],
      },
    });

    expect(actual).toBe(expected);
  });

  test('should transform FormData to an object', () => {
    const instance = cachios.create(axios);

    const fd = new FormData();
    fd.append('foo', 'bar');
    fd.append('transform', 'hello');

    expect(instance.getReplaced(fd)).toEqual({
      foo: 'bar',
      transform: 'hello',
    });
    console.log(typeof cachios);
  });
});
