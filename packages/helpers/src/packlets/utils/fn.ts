import { isDefined, isFunction, TAnyObject, TOption } from '@body-link/type-guards';

export const optionalCall = <Argument extends TOption<FnArgument>, FnArgument, FnReturn>(
  fn: (arg: FnArgument) => FnReturn,
  arg: Argument
): Argument extends undefined ? undefined : FnReturn => {
  return (isDefined(arg) ? fn(arg) : undefined) as Argument extends undefined ? undefined : FnReturn;
};

export const mergeFunctionsInObjects = <T1 extends TAnyObject, T2 extends TAnyObject>(
  a: TOption<T1>,
  b: TOption<T2>
): T1 & T2 => {
  const result = { ...a, ...b };
  if (isDefined(a) && isDefined(b)) {
    for (const key in b) {
      if (b.hasOwnProperty(key)) {
        const bVal = b[key];
        if (isFunction(bVal) && a.hasOwnProperty(key)) {
          const aVal = a[key];
          if (isFunction(aVal)) {
            result[key] = function () {
              aVal.apply(window, arguments);
              bVal.apply(window, arguments);
            };
          }
        }
      }
    }
  }
  return result as T1 & T2;
};
