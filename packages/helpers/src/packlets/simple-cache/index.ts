import { isDefined } from '@body-link/type-guards';

export class SimpleCache<K, V> {
  private readonly _map: Map<K, V> = new Map();
  private readonly _factory: (key: K) => V;

  public constructor(factory: (key: K) => V) {
    this._factory = factory;
  }

  public getOrCreate(key: K, onCreate?: (next: V) => void): V {
    const cached = this._map.get(key);
    if (isDefined(cached)) {
      return cached;
    }
    const created = this._factory(key);
    this._map.set(key, created);
    onCreate?.(created);
    return created;
  }
}
