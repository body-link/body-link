import { HttpError, HttpStatus } from '@marblejs/core';
import { flow, pipe } from 'fp-ts/function';
import * as R from 'fp-ts/Reader';
import * as r from 'rxjs';
import * as ro from 'rxjs/operators';
import { appErrorToMessage, ErrorApp } from '../data/error/ErrorApp';
import { HttpHeaderName, HttpHeaderValue, HttpResponse } from './types';
import { throwException } from './utils';

export const defaultResponse: HttpResponse<void> = {
  status: HttpStatus.OK,
  body: undefined,
  headers: {},
};

export const setStatus =
  <T>(status: HttpStatus): ((res: HttpResponse<T>) => HttpResponse<T>) =>
  ({ body, headers }) => ({
    status,
    body,
    headers,
  });

export const setBody =
  <T1, T2>(body: T2): ((res: HttpResponse<T1>) => HttpResponse<T2>) =>
  ({ status, headers }) => ({
    status,
    body,
    headers,
  });

export const setHeader =
  <T>(name: HttpHeaderName, value: HttpHeaderValue): ((res: HttpResponse<T>) => HttpResponse<T>) =>
  ({ status, body, headers }) => ({
    status,
    body,
    headers: { ...headers, [name]: value },
  });

export const withStatus = (status: HttpStatus): HttpResponse<void> =>
  pipe(defaultResponse, setStatus(status));

export const withStatus$ = <T>(status: HttpStatus): r.OperatorFunction<T, HttpResponse<void>> =>
  ro.mapTo(withStatus(status));

export const withBody = <T>(body: T): HttpResponse<T> => pipe(defaultResponse, setBody(body));

export const withBody$ = <T1, T2>(body: T2): r.OperatorFunction<T1, HttpResponse<T2>> =>
  ro.mapTo(withBody(body));

export const withHeader = (name: HttpHeaderName, value: HttpHeaderValue): HttpResponse<void> =>
  pipe(defaultResponse, setHeader(name, value));

export const asBody$: <T>(source: r.Observable<T>) => r.Observable<HttpResponse<T>> = ro.map(withBody);

export const mapToHttpError =
  (status: HttpStatus): R.Reader<string, HttpError> =>
  (message: string) =>
    new HttpError(message, status);

export const throwErrorAppHttp: (status: HttpStatus) => R.Reader<ErrorApp, never> = (status) =>
  flow(appErrorToMessage, mapToHttpError(status), throwException);
