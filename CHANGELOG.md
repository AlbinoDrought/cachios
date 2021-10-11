# 3.1.0

Adds initial Typescript support.

# 3.0.0

Adds support for asynchronous cache repositories like [keyv](https://www.npmjs.com/package/keyv): https://github.com/AlbinoDrought/cachios/issues/61

- If you use a synchronous cache store and have not modified `getCachedValue` or `setCachedValue` in your project, Cachios v3 will be backwards compatible for you. 

- If you modified Cachios to use an asynchronous cache store, or `getCachedValue` to return promises or undefined values, or `setCachedValue` to return promises, Cachios v3 may not be backwards compatible for you. 

The full change can be viewed in 9ee35e125ee7c8dc08c80da0db9f972c222c0462 , human-readable changes summarized below:

## Cache handling before 3.0.0

Results from `getCachedValue` were passed back to caller as-is.

Results from `setCachedValue` were ignored.

## Cache handling after 3.0.0

Results from `getCachedValue` are resolved using `Promise.resolve`. If they are rejected or resolve to `undefined`, Cachios will assume no cached value exists and will send a fresh request using Axios.

Results from `setCachedValue` are passed up the promise chain.

# 2.2.5

Prevents issues with sharing cancelled promises: https://github.com/AlbinoDrought/cachios/issues/55

# 2.2.4

Support Axios ^0.21.0 and ^0.20.0 in addition to ^0.18.0 and ^0.19.0

# 2.2.3

Support node-cache ^5.0.0 in addition to ^4.1.1

# 2.2.2

Bump object-hash to ^2.0.0

# 2.2.1

Support Axios ^0.19.0 in addition to ^0.18.0

# 2.2.0

Forced cache invalidation added: https://github.com/AlbinoDrought/cachios/commit/d2612ac3052e420644db75ad18b6f29ea326f589

# 2.1.0

Deduplicates simultaneous identical requests: https://github.com/AlbinoDrought/cachios/issues/44

# 2.0.0

This release does not change the public interface to `cachios`, but does vastly change the build process and removes some polyfills.

Because of this, I am releasing it as 2.0.0.

It removes:
- `export`, `import`, `let`, `const`
- eslint, but the project still adheres to `eslint-config-airbnb`
- `babel-runtime` - this could affect browser compatibility, but it "shouldn't". [Axios already requires promises to be natively supported (it does not polyfill them) and that is the only "new JS" we use](https://github.com/axios/axios#promises).

https://github.com/AlbinoDrought/cachios/pull/43
