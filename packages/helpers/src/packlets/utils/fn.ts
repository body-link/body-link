import { isDefined, isFunction, TOption } from '@body-link/type-guards';

export const optionalCall = <Argument extends TOption<FnArgument>, FnArgument, FnReturn>(
  fn: (arg: FnArgument) => FnReturn,
  arg: Argument
): Argument extends undefined ? undefined : FnReturn => {
  return (isDefined(arg) ? fn(arg) : undefined) as Argument extends undefined ? undefined : FnReturn;
};

export const mergeFunctionsInObjects = <T1, T2>(a: TOption<T1>, b: TOption<T2>): T1 & T2 => {
  const result = { ...a, ...b } as T1 & T2;
  if (isDefined(a) && isDefined(b)) {
    for (const aKey in a) {
      if (aKey in b) {
        const aVal = (a as unknown as Record<string, unknown>)[aKey];
        const bVal = (b as unknown as Record<string, unknown>)[aKey];
        if (isFunction(aVal) && isFunction(bVal)) {
          (result as Record<string, unknown>)[aKey] = function () {
            aVal.apply(window, arguments);
            bVal.apply(window, arguments);
          };
        }
      }
    }
  }
  return result;
};
