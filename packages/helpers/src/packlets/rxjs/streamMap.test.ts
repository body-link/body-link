import { from } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { observe } from 'rxjs-marbles/jest';
import { streamMap } from './streamMap';

describe('streamMap', () => {
  it(
    'should map an observable on memoized values',
    observe(() => {
      let creationTime = 0;
      const mock = jest.fn((value: unknown) => ({ wrapped: value, creationTime: creationTime++ }));
      const items = [[], {}, () => {}];
      const expected = [
        [{ wrapped: items[0], creationTime: 0 }],
        [
          { wrapped: items[0], creationTime: 0 },
          { wrapped: items[1], creationTime: 1 },
        ],
        [
          { wrapped: items[0], creationTime: 0 },
          { wrapped: items[1], creationTime: 1 },
          { wrapped: items[2], creationTime: 2 },
        ],
        [
          { wrapped: items[2], creationTime: 2 },
          { wrapped: items[1], creationTime: 1 },
          { wrapped: items[0], creationTime: 0 },
        ],
      ];
      return streamMap(from([items.slice(0, 1), items.slice(0, 2), items, [...items].reverse()]), mock).pipe(
        map((values, index) => {
          expect(values.length).toBe(index > 2 ? items.length : index + 1);
          values.forEach((value, valueIndex) => {
            expect(value.wrapped).toBe(expected[index][valueIndex].wrapped);
            expect(value.creationTime).toBe(expected[index][valueIndex].creationTime);
          });
        }),
        finalize(() => {
          expect(creationTime).toBe(items.length);
          expect(mock).toBeCalledTimes(items.length);
        })
      );
    })
  );
});
