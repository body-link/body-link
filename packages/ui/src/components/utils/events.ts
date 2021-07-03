import { BehaviorSubject, fromEvent, MonoTypeOperatorFunction, Observable } from 'rxjs';
import { distinctUntilChanged, filter, map, share, startWith } from 'rxjs/operators';
import { isHTMLElement } from '@body-link/type-guards';
import { KEY_ESCAPE } from '@body-link/helpers';

export const isDocumentVisible$: Observable<boolean> = fromEvent<MouseEvent>(
  document,
  'visibilitychange'
).pipe(
  startWith(1),
  map(() => document.visibilityState === 'visible'),
  distinctUntilChanged(),
  share()
);

export const documentClick$: Observable<MouseEvent> = fromEvent<MouseEvent>(document, 'click').pipe(share());

export const mouseMove$: Observable<MouseEvent> = fromEvent<MouseEvent>(document, 'mousemove').pipe(share());
export const mouseDown$: Observable<MouseEvent> = fromEvent<MouseEvent>(document, 'mousedown').pipe(share());
export const mouseUp$: Observable<MouseEvent> = fromEvent<MouseEvent>(document, 'mouseup').pipe(share());

// mouse [x,y] coordinates
export const mouseLastPosition$: BehaviorSubject<[number, number]> = new BehaviorSubject<[number, number]>([
  0, 0,
]);
mouseMove$
  .pipe(map(({ clientX: x, clientY: y }) => [x, y] as [number, number]))
  .subscribe(mouseLastPosition$);

const filterEditable$: MonoTypeOperatorFunction<KeyboardEvent> = filter(({ target: el }: KeyboardEvent) => {
  if (isHTMLElement(el)) {
    return !(
      el.tagName === 'INPUT' ||
      el.tagName === 'SELECT' ||
      el.tagName === 'TEXTAREA' ||
      el.isContentEditable
    );
  } else {
    return false;
  }
});

export const anyKeyPress$: Observable<KeyboardEvent> = fromEvent<KeyboardEvent>(document, 'keydown');

export const anyKeyPressSafe$: Observable<KeyboardEvent> = anyKeyPress$.pipe(filterEditable$);

export const escPress$: Observable<KeyboardEvent> = anyKeyPress$.pipe(
  filter((e) => e.keyCode === KEY_ESCAPE),
  share()
);

export const escPressSafe$: Observable<KeyboardEvent> = escPress$.pipe(filterEditable$, share());

export const windowWheel$: Observable<WheelEvent> = fromEvent<WheelEvent>(window, 'wheel', {
  passive: false,
}).pipe(share());

// https://stackoverflow.com/a/52809105
const history: History = window.history;
const EVENT_NAME_LOCATION_CHANGE: string = 'locationchange';

history.pushState = ((f) =>
  function pushState() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ret = f.apply(history, arguments as any);
    window.dispatchEvent(new Event(EVENT_NAME_LOCATION_CHANGE));
    return ret;
  })(history.pushState);

history.replaceState = ((f) =>
  function replaceState() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ret = f.apply(history, arguments as any);
    window.dispatchEvent(new Event(EVENT_NAME_LOCATION_CHANGE));
    return ret;
  })(history.replaceState);

window.addEventListener('popstate', () => {
  window.dispatchEvent(new Event(EVENT_NAME_LOCATION_CHANGE));
});

export const locationChange$: Observable<Event> = fromEvent<Event>(window, EVENT_NAME_LOCATION_CHANGE).pipe(
  share()
);

export const observeElementSize$ = (el: HTMLElement): Observable<[number, number]> =>
  new Observable<[number, number]>((subscriber) => {
    let { width, height } = el.getBoundingClientRect();
    const resizeObserver = new ResizeObserver((entries) => {
      const rect = entries[0].target.getBoundingClientRect();
      const nextWidth = Math.round(rect.width);
      const nextHeight = Math.round(rect.height);
      if (width !== nextWidth || height !== nextHeight) {
        width = nextWidth;
        height = nextHeight;
        subscriber.next([width, height]);
      }
    });
    resizeObserver.observe(el);
    return () => resizeObserver.unobserve(el);
  });
