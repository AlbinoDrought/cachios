const cachios = require('cachios');
const Keyv = require('keyv');

cachios.cache = new Keyv('sqlite://cache.sqlite');

async function getCacheCount() {
  const cacheSize = await cachios.cache.opts.store.query('SELECT COUNT(*) as count FROM keyv');
  return cacheSize[0].count;
}

async function main() {
  let cacheSize = await getCacheCount();
  console.log('On boot, cache size is', cacheSize);
  for (let i = 0; i < 10; i++) {
    const start = new Date();
    await cachios.get('https://example.com/');
    const end = new Date();
    
    const newCacheSize = await getCacheCount();
    console.log('Run', i, 'took', end.getTime() - start.getTime(), 'ms', 'cache size changed by', newCacheSize - cacheSize);
    cacheSize = newCacheSize;
  }
}

main();
