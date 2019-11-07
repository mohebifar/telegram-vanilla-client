export function debounce<T extends (...args: any[]) => any>(
  callback: T,
  wait: number,
  immediate = false
): (...args: Parameters<T>) => ReturnType<T> | number {
  let timeout = null;

  return function() {
    const callNow = immediate && !timeout;
    const next = () => callback.apply(this, arguments);

    if (callNow) {
      timeout = null;
      return next();
    }

    clearTimeout(timeout);
    timeout = setTimeout(next, wait);

    return timeout;
  };
}
