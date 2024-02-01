import fs from 'fs';
import * as R from 'ramda';

const data = JSON.parse(fs.readFileSync('./result.json', 'utf8'));

const counters: Record<string, number> = {};

for (let k in data) {
  const item = data[k];
  item.buttons.forEach((button: { title: string }) => {
    if (counters[button.title]) {
      counters[button.title]++;
    } else {
      counters[button.title] = 1;
    }
  })
}

const list = R.toPairs(counters).sort((a, b) => b[1] - a[1]);

const length = Math.min(20, list.length);
for (let i = 0; i < length; i++) {
  console.log(`${list[i][0]}: ${list[i][1]}`);
}
