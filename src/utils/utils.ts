export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export function formatPhoneNumber(phoneNumber: string) {
  const cleaned = phoneNumber.replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

  if (match) {
    return ["(", match[1], ") ", match[2], "-", match[3]].join("");
  }
  return phoneNumber;
}

export function debounce<T extends Function>(callback: T, wait = 300) {
  let timeout: number;

  return (function(...args: any[]) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => callback.apply(context, args), wait);
  } as never) as T;
}

export function throttle<T extends Function>(
  callback: T,
  wait = 300,
  immediate = false
) {
  let timeout = null;

  return (function(...args: any[]) {
    const next = (skipCall = false) => {
      if (!skipCall) {
        callback.apply(this, args);
      }
      timeout = null;
    };

    if (!timeout && immediate) {
      next();
    }

    if (!timeout) {
      timeout = setTimeout(next, wait, immediate);
    }
  } as never) as T;
}

export const toListSentence = (arr: string[]) =>
  arr.length < 3
    ? arr.join(" and ")
    : `${arr.slice(0, -1).join(", ")}, and ${arr[arr.length - 1]}`;
