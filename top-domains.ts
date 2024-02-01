import fs from 'fs';
import * as R from 'ramda';

const data = JSON.parse(fs.readFileSync('./result.json', 'utf8'));

const counters: Record<string, number> = {};

for (let k in data) {
  const item = data[k];
  const url = new URL(item.url)
  const rootDomain = url.hostname.split('.').slice(-2).join('.');
  if (counters[rootDomain]) {
    counters[rootDomain]++;
  } else {
    counters[rootDomain] = 1;
  }
}

const list = R.toPairs(counters).sort((a, b) => b[1] - a[1]);

const length = Math.min(20, list.length);
for (let i = 0; i < length; i++) {
  console.log(`${list[i][0]}: ${list[i][1]}`);
}
