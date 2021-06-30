import { TIdentifier } from '@body-link/type-guards';
import { arrayToRecord } from './immutable';

export interface IArrayDifferences<T> {
  added: T[];
  removed: T[];
  unchanged: T[];
}

export const getArrayDifferences = <T>(
  original: T[],
  next: T[],
  getHash?: (item: T) => TIdentifier
): IArrayDifferences<T> => {
  const added: T[] = [];
  const removed: T[] = [];
  const unchanged: T[] = [];
  const hashOriginal = arrayToRecord(original, getHash);
  const hashNext = arrayToRecord(next, getHash);
  for (const hash in hashOriginal) {
    if (hash in hashNext) {
      unchanged.push(hashOriginal[hash]);
    } else {
      removed.push(hashOriginal[hash]);
    }
  }
  for (const hash in hashNext) {
    if (!(hash in hashOriginal)) {
      added.push(hashNext[hash]);
    }
  }
  return {
    added,
    removed,
    unchanged,
  };
};
