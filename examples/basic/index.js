const cachios = require('cachios');

async function main() {
  for (let i = 0; i < 10; i++) {
    const start = new Date();
    await cachios.get('https://example.com/');
    const end = new Date();

    console.log('Run', i, 'took', end.getTime() - start.getTime(), 'ms');
  }
}

main();
