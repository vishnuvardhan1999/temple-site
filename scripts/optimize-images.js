// Makes web-sized copies of the carousel photos so the home page loads quickly.
//
// Put original photos (any size, any case of extension) in:   photos/carousel/
// Then run:                                                   npm run images
// Web-sized copies are written to:                            src/assets/carousel/
//
// Originals are never changed. Files are named by number (1.jpg, 2.jpg, ...)
// and the carousel shows them in that order.

import { readdir, mkdir, rm, stat } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const SOURCE_DIR = 'photos/carousel'
const OUTPUT_DIR = 'src/assets/carousel'
// The carousel frame is wide and short (about 600px tall on a large screen),
// so 1200px covers high-resolution screens for both landscape and portrait photos.
const MAX_WIDTH = 1600
const MAX_HEIGHT = 1200
const QUALITY = 78

const isImage = (file) => /\.(jpe?g|png|webp|heic)$/i.test(file)

const files = (await readdir(SOURCE_DIR)).filter(isImage)

if (files.length === 0) {
  console.log(`No images found in ${SOURCE_DIR}/`)
  process.exit(0)
}

// Start from an empty output folder so removed photos disappear from the carousel
await rm(OUTPUT_DIR, { recursive: true, force: true })
await mkdir(OUTPUT_DIR, { recursive: true })

let before = 0
let after = 0

for (const file of files) {
  const name = path.parse(file).name
  const input = path.join(SOURCE_DIR, file)
  const output = path.join(OUTPUT_DIR, `${name}.jpg`)

  const { size: inSize } = await stat(input)
  const info = await sharp(input)
    .rotate() // respect the camera's orientation
    .resize({ width: MAX_WIDTH, height: MAX_HEIGHT, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: QUALITY, progressive: true, mozjpeg: true })
    .toFile(output)

  before += inSize
  after += info.size
  console.log(`${file.padEnd(16)} ${kb(inSize).padStart(8)} -> ${kb(info.size).padStart(7)}  (${info.width}x${info.height})`)
}

console.log(`\nTotal: ${kb(before)} -> ${kb(after)}`)

function kb(bytes) {
  return `${Math.round(bytes / 1024)} KB`
}
