// boilerplate helper method code inspired by axios/lib/core/Axios.js ;)
var datalessMethods = [
  'delete',
  'get',
  'head',
  'options',
];

var dataMethods = [
  'post',
  'put',
  'patch',
];

function aliasDatalessMethod(method) {
  return function (url, config) {
    var mergedRequest = config || {};

    mergedRequest.url = url;
    mergedRequest.method = method;

    return this.request(mergedRequest);
  };
};

function aliasDataMethod(method) {
  return function (url, data, config) {
    var mergedRequest = config || {};

    mergedRequest.url = url;
    mergedRequest.method = method;
    mergedRequest.data = data;

    return this.request(mergedRequest);
  };
};

function extendPrototype(cachiosPrototype) {
  // these methods take two params (no `data`)
  for (var i = 0; i < datalessMethods.length; i += 1) {
    var method = datalessMethods[i];

    cachiosPrototype[method] = aliasDatalessMethod(method);
  }

  // these methods take three params and have a different signature
  for (var i = 0; i < dataMethods.length; i += 1) {
    var method = dataMethods[i];

    cachiosPrototype[method] = aliasDataMethod(method);
  }
}

module.exports = extendPrototype;
