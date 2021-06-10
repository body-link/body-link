import { debug } from './debug';
import { cases } from 'rxjs-marbles/jest';

describe('debug', () => {
  beforeEach(() => {
    jest.spyOn(console, 'log');
  });

  cases(
    'should support cases',
    (m, c) => {
      const source = m.hot(c.s);
      const expected = m.cold(c.e);
      const destination = source.pipe(debug('title'));
      m.expect(destination).toBeObservable(expected);
      m.expect(source).toHaveSubscriptions(c.t);
    },
    {
      'non-empty': {
        s: '-a-b|',
        e: '-a-b|',
        t: '^---!',
      },
      'non-empty with error': {
        s: '-a-#',
        e: '-a-#',
        t: '^--!',
      },
      'empty': {
        s: '-|',
        e: '-|',
        t: '^!',
      },
    }
  );
});
