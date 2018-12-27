# 2.1.0

Deduplicates simultaneous identical requests: https://github.com/AlbinoDrought/cachios/issues/44

# 2.0.0

This release does not change the public interface to `cachios`, but does vastly change the build process and removes some polyfills.

Because of this, I am releasing it as 2.0.0.

It removes:
- `export`, `import`, `let`, `const`
- eslint, but the project still adheres to `eslint-config-airbnb`
- `babel-runtime` - this could affect browser compatibility, but it "shouldn't". [Axios already requires promises to be natively supported (it does not polyfill them) and that is the only "new JS" we use](https://github.com/axios/axios#promises).
