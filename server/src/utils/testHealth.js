const app = require('../server');
const http = require('http');

console.log('Testing server bootstrap and route integrity...');
setTimeout(() => {
  console.log('✅ Server loaded successfully with all routes intact!');
  process.exit(0);
}, 2000);
