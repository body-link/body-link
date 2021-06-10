import { Observable } from 'rxjs';
import { map, scan } from 'rxjs/operators';

export const streamMap = <T1, T2>(
  stream: Observable<T1[]>,
  createItem: (value: T1) => T2
): Observable<T2[]> => {
  return stream.pipe(
    scan<T1[], [Map<T1, T2>, T2[]]>(
      ([prev], values) => {
        const next = new Map<T1, T2>();
        const items = values.map((value) => {
          if (next.has(value)) {
            return next.get(value) as T2;
          } else {
            const item = prev.has(value) ? (prev.get(value) as T2) : createItem(value);
            next.set(value, item);
            return item;
          }
        });
        return [next, items];
      },
      [new Map(), []]
    ),
    map(([, items]) => items)
  );
};
