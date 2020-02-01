import jBigInt, {
  BigInteger as JBigInt,
  gcd,
  randBetween,
  min
} from "big-integer";

export class Factorizator {
  static findSmallMultiplierLopatin(pq: JBigInt) {
    if (pq.mod(2).equals(0)) {
      return jBigInt(2);
    }

    const pqMinusOne = pq.minus(1);
    let y = randBetween(1, pqMinusOne);
    let c = randBetween(1, pqMinusOne);
    let m = randBetween(1, pqMinusOne);
    let g = jBigInt(1);
    let r = jBigInt(1);
    let q = jBigInt(1);
    let x = jBigInt(0);
    let ys = jBigInt(0);

    while (g.equals(1)) {
      x = y;

      for (let i = jBigInt(0); i.lesser(r); i = i.add(1)) {
        y = y
          .modPow(2, pq)
          .add(c)
          .mod(pq);
      }

      let k = jBigInt(0);
      while (k.lesser(r) && g.equals(1)) {
        ys = y;

        const range = min(m, r.minus(k));
        for (let i = jBigInt(0); i.lesser(range); i = i.add(1)) {
          y = y
            .modPow(2, pq)
            .add(c)
            .mod(pq);
          q = q.multiply(x.minus(y).abs()).mod(pq);
        }
        g = gcd(q, pq);
        k = k.add(m);
      }

      r = r.multiply(2);
    }

    if (g.equals(pq)) {
      while (true) {
        ys = ys
          .modPow(2, pq)
          .add(c)
          .mod(pq);
        g = gcd(x.minus(ys).abs(), pq);
        if (g.greater(1)) {
          break;
        }
      }
    }

    const p = pq.divide(g);

    return p.lesser(g) ? p : g;
  }

  /**
   * Calculates the greatest common divisor
   */
  static gcd(a: JBigInt, b: JBigInt) {
    while (!a.equals(0) && !b.equals(0)) {
      while (b.and(1).equals(0)) {
        b = b.shiftRight(1);
      }

      while (a.and(1).equals(0)) {
        a = a.shiftRight(1);
      }
      if (a.greater(b)) {
        a = a.minus(b);
      } else {
        b = b.minus(a);
      }
    }
    return b.equals(0) ? a : b;
  }

  /**
   * Factorizes the given number and returns both the divisor and the number divided by the divisor
   */
  static factorize(pq: JBigInt): { p: JBigInt; q: JBigInt } {
    const divisor = this.findSmallMultiplierLopatin(pq);
    return { p: divisor, q: pq.divide(divisor) };
  }
}
