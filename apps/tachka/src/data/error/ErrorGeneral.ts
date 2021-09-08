/* eslint-disable @typescript-eslint/naming-convention,@rushstack/typedef-var */
import { AsOpaque, AType, EType, summon } from '../utils';

const ErrorGeneral_ = summon((F) =>
  F.interface(
    {
      type: F.stringLiteral('ErrorGeneral'),
      name: F.string(),
      message: F.string(),
    },
    'ErrorGeneral'
  )
);
export interface ErrorGeneral extends AType<typeof ErrorGeneral_> {}
export interface ErrorGeneralRaw extends EType<typeof ErrorGeneral_> {}
export const ErrorGeneral = AsOpaque<ErrorGeneralRaw, ErrorGeneral>()(ErrorGeneral_);
