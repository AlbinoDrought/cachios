// boilerplate helper method code inspired by axios/lib/core/Axios.js ;)
const datalessMethods = [
  'delete',
  'get',
  'head',
  'options',
];

const dataMethods = [
  'post',
  'put',
  'patch',
];

function extendPrototype(cachiosPrototype) {
  datalessMethods.forEach((method) => {
    cachiosPrototype[method] = (url, config) => {
      const baseRequest = {
        url,
        method,
      };

      const mergedRequest = Object.assign(config || {}, baseRequest);

      return cachiosPrototype.request(mergedRequest);
    };
  });

  dataMethods.forEach((method) => {
    cachiosPrototype[method] = (url, data, config) => {
      const baseRequest = {
        url,
        method,
        data,
      };

      const mergedRequest = Object.assign(config || {}, baseRequest);

      return cachiosPrototype.request(mergedRequest);
    };
  });
}

module.exports = extendPrototype;
