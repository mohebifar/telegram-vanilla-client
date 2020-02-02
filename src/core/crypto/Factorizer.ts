import jBigInt, {
  BigInteger as JBigInt,
  gcd,
  randBetween,
  min
} from "big-integer";

export class Factorizator {
  static findSmallMultiplier(pq: JBigInt) {
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

  static factorize(pq: JBigInt): { p: JBigInt; q: JBigInt } {
    const divisor = this.findSmallMultiplier(pq);
    return { p: divisor, q: pq.divide(divisor) };
  }
}
