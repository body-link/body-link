import fs from 'fs';
import path from 'path';

export const createParentDir = (filePath: string): void => {
  const parentDir = path.dirname(filePath);
  if (fs.existsSync(parentDir)) {
    return;
  }
  createParentDir(parentDir);
  fs.mkdirSync(parentDir);
};

export const removeDir = (dir: string): void => fs.rmdirSync(dir, { recursive: true });

export const writeLines = (filePath: string, lines: Generator<string, void, undefined>): void => {
  createParentDir(filePath);
  const fd = fs.openSync(filePath, 'w');
  fs.writeFileSync(fd, '');
  for (const line of lines) {
    fs.appendFileSync(fd, `${line}\n`);
  }
  fs.closeSync(fd);
};

export function capitalize(word: string): string {
  const empty = '' as const;
  const [c, ...cs] = word.split(empty);
  if (typeof c === 'undefined') {
    throw new Error('assert false');
  }
  return [c.toUpperCase(), ...cs].join(empty);
}

// ALL_UPPER-CASE => ALL_UPPERCASE
function typenameFromAllCaps(allCaps: string): string {
  return allCaps.split('-').join('');
}

// random-caseCombination => RandomCaseCombination
export const typenameFromKebab = (kebab: string): string => kebab.split('-').map(capitalize).join('');

function isAllCaps(randomCase: string): boolean {
  return randomCase === randomCase.toUpperCase();
}

function typenameFromRandom(randomCase: string): string {
  if (isAllCaps(randomCase)) {
    return typenameFromAllCaps(randomCase);
  }
  return typenameFromKebab(randomCase);
}

export function getDefaultExport(jsonFilePath: string): string {
  const [withoutPath] = jsonFilePath.split('/').slice(-1);
  if (typeof withoutPath === 'undefined') {
    throw new Error('assert false');
  }
  const [withoutExtension] = withoutPath.split('.json');
  if (typeof withoutExtension === 'undefined') {
    throw new Error('assert false');
  }
  return typenameFromRandom(withoutExtension);
}
