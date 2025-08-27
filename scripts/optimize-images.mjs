#!/usr/bin/env node
// Reusable image optimizer: reads from ./img and writes to ./public/images/optimized
// Generates AVIF and WEBP in multiple sizes, strips metadata, and preserves
// original filename with size suffixes.

import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

const ROOT = process.cwd();
const INPUT_DIR = path.join(ROOT, 'img');
const OUTPUT_DIR = path.join(ROOT, 'public', 'images', 'optimized');

const VALID_EXT = new Set(['.jpg', '.jpeg', '.png']);
const SIZES = [
  { name: 'lg', width: 1920 },
  { name: 'md', width: 1280 },
  { name: 'sm', width: 800 },
];

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function listImages(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  return entries
    .filter((d) => d.isFile())
    .map((d) => path.join(dir, d.name))
    .filter((p) => VALID_EXT.has(path.extname(p).toLowerCase()));
}

async function optimizeOne(filePath) {
  const base = path.basename(filePath);
  const ext = path.extname(base);
  const name = base.slice(0, -ext.length);

  const input = sharp(filePath, { failOnError: false });
  const meta = await input.metadata();
  const srcWidth = meta.width || 4096;

  const tasks = [];

  for (const size of SIZES) {
    const width = Math.min(size.width, srcWidth);
    const common = input.clone().resize({ width, fit: 'inside', withoutEnlargement: true, fastShrinkOnLoad: true });

    // AVIF
    tasks.push(
      common
        .clone()
        .avif({ quality: 55, effort: 3 })
        .toFile(path.join(OUTPUT_DIR, `${name}-${size.name}.avif`))
    );

    // WEBP
    tasks.push(
      common
        .clone()
        .webp({ quality: 75 })
        .toFile(path.join(OUTPUT_DIR, `${name}-${size.name}.webp`))
    );
  }

  // Also emit a compressed JPEG (max 2048px) for fallbacks
  tasks.push(
    input
      .clone()
      .resize({ width: Math.min(2048, srcWidth), fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 80, mozjpeg: true })
      .toFile(path.join(OUTPUT_DIR, `${name}-max2048.jpg`))
  );

  await Promise.all(tasks);
  return { name, generated: SIZES.map((s) => [`${name}-${s.name}.avif`, `${name}-${s.name}.webp`]).flat() };
}

async function main() {
  await ensureDir(OUTPUT_DIR);
  try {
    const files = await listImages(INPUT_DIR);
    if (!files.length) {
      console.log(`No images found in ${INPUT_DIR}. Valid extensions: ${[...VALID_EXT].join(', ')}`);
      return;
    }
    console.log(`Optimizing ${files.length} image(s)...`);
    for (const fp of files) {
      const rel = path.relative(ROOT, fp);
      process.stdout.write(`  • ${rel} ... `);
      try {
        const out = await optimizeOne(fp);
        console.log(`done -> ${out.generated.join(', ')}`);
      } catch (err) {
        console.error(`failed:`, err?.message || err);
      }
    }
    console.log(`Output written to ${path.relative(ROOT, OUTPUT_DIR)}`);
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  }
}

main();



