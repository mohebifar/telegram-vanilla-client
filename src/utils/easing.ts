type Easing = (t: number) => number;

interface Animation {
  from: number;
  to: number;
}

interface Animations {
  [s: string]: Animation;
}

export const easeInQuad: Easing = t => t * t;
export const easeOutQuad: Easing = t => t * (2 - t);
export const easeInOutQuad: Easing = t =>
  t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
export const linear: Easing = t => t;
export const linearHalf: Easing = t => Math.max(2 * t - 1, 0);

export function startAnimation<
  T extends Animations,
  R extends { [k in keyof T]: number }
>(
  animations: T,
  callback: (values: R) => any,
  finishCallback?: () => any,
  duration = 300,
  easing = easeOutQuad
) {
  let stop = false;
  let start: number;
  let end: number;

  function startAnim(now: number) {
    start = now;
    end = start + duration;
    draw(now);
  }

  function draw(now: number) {
    if (stop) {
      if (finishCallback) {
        finishCallback();
      }
      return;
    }
    if (now >= end) {
      stop = true;
    }
    const p = Math.min((now - start) / duration, 1);
    const val = easing(p);
    const result: R = {} as any;
    for (const key in animations) {
      const animation = animations[key];
      (result as any)[key] =
        animation.from + (animation.to - animation.from) * val;
    }
    callback(result);
    requestAnimationFrame(draw);
  }

  requestAnimationFrame(startAnim);
}
