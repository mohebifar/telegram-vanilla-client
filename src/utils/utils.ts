export const sleep = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms));

export function formatPhoneNumber(phoneNumber: string) {
  const cleaned = phoneNumber.replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

  if (match) {
    return ["(", match[1], ") ", match[2], "-", match[3]].join("");
  }
  return phoneNumber;
}

export function debounce<T extends Function>(func: T, wait = 300) {
  let timeout: number;

  return (function(...args: any[]) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  } as never) as T;
}
