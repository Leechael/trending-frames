import * as R from 'ramda'
import fs from 'node:fs'

interface CastFrameButton {
  index: number
  title: string
  type: 'post' | 'post_redirect'
}

interface CastFrame {
  id: string
  url: string
  buttons: CastFrameButton[]
  replies: number
  reactions: number
  watches: number
}

const response = await fetch('https://client.warpcast.com/v2/feed-items', {
  method: 'post',
  headers: {
    'Content-Type': 'application/json',
  },
  body: '{"feedKey": "trending-frames","viewedCastHashes": "","updateState": false}'
});
const json = await response.json();

const transform = R.pipe(
  R.paths([
    ['id'],
    // url
    ['cast', 'embeds', 'urls', '0', 'openGraph', 'url'],
    // buttons
    ['cast', 'embeds', 'urls', '0', 'openGraph', 'frame', 'buttons'],
    // replies
    ['cast', 'replies', 'count'],
    // reactions
    ['cast', 'reactions', 'count'],
    // watches
    ['cast', 'watches', 'count'],
  ]),
  R.zipObj(['id', 'url', 'buttons', 'replies', 'reactions', 'watches']),
)

const items = R.map(transform, R.pathOr([], ['result', 'items'], json)) as unknown as any[]

let db: Record<string, CastFrame> = {}
if (fs.existsSync('result.json')) {
  db = JSON.parse(fs.readFileSync('result.json', 'utf8'))
}

let counter = 0
for (let k of items) {
  if (db[k.id]) {
    continue
  }
  db[k.id] = k
  counter++
}

fs.writeFileSync('result.json', JSON.stringify(db, null, 2))

console.log(`Added ${counter} new items`)