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
