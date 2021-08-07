export type TIdentifier = string | number;

export type TReal = boolean | string | number;

// eslint-disable-next-line @rushstack/no-new-null
export type TPrimitive = undefined | null | TReal;

export type TOption<T> = T | undefined;

// eslint-disable-next-line @rushstack/no-new-null
export type TNullable<T> = T | undefined | null;

export type TUnboxArray<T> = T extends (infer U)[] ? U : T;

export type TNoop = () => void;

export type TMutable<T> = {
  -readonly [P in keyof T]: T[P];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TAnyObject = Record<any, unknown>;

// https://github.com/microsoft/TypeScript/issues/15300#issuecomment-771916993
export type TTypify<T> = { [K in keyof T]: T[K] };
