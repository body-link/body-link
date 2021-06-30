import { isDefined, TOption } from '@body-link/type-guards';

export const optionalCall = <Argument extends TOption<FnArgument>, FnArgument, FnReturn>(
  fn: (arg: FnArgument) => FnReturn,
  arg: Argument
): Argument extends undefined ? undefined : FnReturn => {
  return (isDefined(arg) ? fn(arg) : undefined) as Argument extends undefined ? undefined : FnReturn;
};
