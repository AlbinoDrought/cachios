module.exports = {
  // rollup creates some funky excess, so coverage results won't be correct.
  collectCoverage: false,
  modulePathIgnorePatterns: [
    // don't load our unbuilt code
    '<rootDir>/src/',
    // don't upset the haste-map when looking for our package
    '<rootDir>/dist/package.json',
  ],
  moduleNameMapper: {
    '^cachios$': '<rootDir>/dist/index.js',
  },
  transformIgnorePatterns: [
    // default, including for safety (tm)
    '/node_modules/',
    // don't transform dist - it should work as-is
    '/dist/',
  ],
};
