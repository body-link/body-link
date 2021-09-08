/* eslint-disable @typescript-eslint/naming-convention,@rushstack/typedef-var */
import { ADTType } from '@morphic-ts/adt';
import { AOfMorphADT, Variant } from '../utils';
import { ErrorDecode } from './ErrorDecode';
import { ErrorGeneral } from './ErrorGeneral';

export const ErrorApp = Variant({
  ErrorGeneral,
  ErrorDecode,
});
export type ErrorApp = AOfMorphADT<typeof ErrorApp>;

export const ErrorIO = ErrorApp.select(['ErrorGeneral', 'ErrorDecode']);
export type ErrorIO = ADTType<typeof ErrorIO>;

export const appErrorToMessage = ErrorApp.matchStrict({
  ErrorGeneral: (e) => e.message,
  ErrorDecode: (e) => e.errors.join('\n'),
});
