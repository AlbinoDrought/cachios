# Persistent Cache Cachios Example

Using Cachios with persistent SQLite cache using [keyv](https://www.npmjs.com/package/keyv) and the [@keyv/sqlite](https://www.npmjs.com/package/@keyv/sqlite) adapter

```sh
npm install
# Run once
node index.js
# Run again, will load cache from disk
node index.js
```

## Expected Output

Run 1:

```
On boot, cache size is 0
Run 0 took 78 ms cache size changed by 1
Run 1 took 0 ms cache size changed by 0
Run 2 took 0 ms cache size changed by 0
Run 3 took 0 ms cache size changed by 0
Run 4 took 0 ms cache size changed by 0
Run 5 took 0 ms cache size changed by 0
Run 6 took 1 ms cache size changed by 0
Run 7 took 0 ms cache size changed by 0
Run 8 took 0 ms cache size changed by 0
Run 9 took 0 ms cache size changed by 0
```

Run 2:

```
On boot, cache size is 1
Run 0 took 3 ms cache size changed by 0
Run 1 took 1 ms cache size changed by 0
Run 2 took 0 ms cache size changed by 0
Run 3 took 0 ms cache size changed by 0
Run 4 took 0 ms cache size changed by 0
Run 5 took 0 ms cache size changed by 0
Run 6 took 1 ms cache size changed by 0
Run 7 took 0 ms cache size changed by 0
Run 8 took 1 ms cache size changed by 0
Run 9 took 0 ms cache size changed by 0
```
