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
    cachiosPrototype[method] = function aliasDatalessMethod(url, config) {
      const baseRequest = {
        url,
        method,
      };

      const mergedRequest = Object.assign(config || {}, baseRequest);

      return this.request(mergedRequest);
    };
  });

  dataMethods.forEach((method) => {
    cachiosPrototype[method] = function aliasDataMethod(url, data, config) {
      const baseRequest = {
        url,
        method,
        data,
      };

      const mergedRequest = Object.assign(config || {}, baseRequest);

      return this.request(mergedRequest);
    };
  });
}

module.exports = extendPrototype;
