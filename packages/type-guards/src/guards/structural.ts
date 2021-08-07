// See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures

// eslint-disable-next-line @rushstack/no-new-null
export const isNull = <T>(term: T | null): term is null => {
  return term === null;
};

// eslint-disable-next-line @typescript-eslint/ban-types
export const isFunction = <T extends Function, U>(term: T | U): term is T => {
  return typeof term === 'function';
};

// eslint-disable-next-line @typescript-eslint/ban-types
export const isObject = <T extends object, U>(term: T | U): term is NonNullable<T> => {
  return !isNull(term) && typeof term === 'object';
};

// eslint-disable-next-line @typescript-eslint/ban-types
export const isArray = <T, U>(term: Array<T> | U): term is Array<T> => {
  return Array.isArray(term);
};

export const isMap = <K, V, U>(term: Map<K, V> | U): term is Map<K, V> => {
  return term instanceof Map;
};

export const isSet = <T, U>(term: Set<T> | U): term is Set<T> => {
  return term instanceof Set;
};

// eslint-disable-next-line @typescript-eslint/ban-types
export const isWeakMap = <K extends object, V, U>(term: WeakMap<K, V> | U): term is WeakMap<K, V> => {
  return term instanceof WeakMap;
};

// eslint-disable-next-line @typescript-eslint/ban-types
export const isWeakSet = <T extends object, U>(term: WeakSet<T> | U): term is WeakSet<T> => {
  return term instanceof WeakSet;
};

export const isDate = <U>(term: Date | U): term is Date => {
  return term instanceof Date;
};

export const isError = (term: unknown): term is Error => {
  const tag = toString.call(term);
  switch (tag) {
    case '[object Error]':
      return true;
    case '[object Exception]':
      return true;
    case '[object DOMException]':
      return true;
    default:
      return term instanceof Error;
  }
};
