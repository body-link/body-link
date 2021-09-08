/* eslint-disable @typescript-eslint/naming-convention,@rushstack/typedef-var */
import { AsOpaque, AType, EType, summon } from '../utils';

const ErrorDecode_ = summon((F) =>
  F.interface(
    {
      type: F.stringLiteral('ErrorDecode'),
      errors: F.array(F.string()),
    },
    'ErrorDecode'
  )
);
export interface ErrorDecode extends AType<typeof ErrorDecode_> {}
export interface ErrorDecodeRaw extends EType<typeof ErrorDecode_> {}
export const ErrorDecode = AsOpaque<ErrorDecodeRaw, ErrorDecode>()(ErrorDecode_);
