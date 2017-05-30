import { SomedayProperty } from './-someday-property';

/**
 * A Someday is an operation that might happen. Some day.
 * Somedays are automatically canceled whenever.
 * Just not feeling it sometimes, ya know.
 *
 * To define a someday, use the `someday(...)` function, and pass in
 * a generator function, which will be invoked (maybe) when the someday
 * is performed. The reason generator functions are used is
 * that they (like the proposed ES7 async-await syntax) can
 * be used to elegantly express asynchronous, cancelable
 * operations that might occur. Someday. Who knows?
 *
 * @param {function} generatorFunction the generator function backing the someday.
 * @returns {SomedayProperty}
 */
export function someday(...args) {
  return new SomedayProperty(...args);
}
