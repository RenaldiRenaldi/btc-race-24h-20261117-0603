import { runBars } from './vendor/makefun-bars.ts';

// All signals use observed closes. Orders execute at the following open.
const closes: number[] = [];
let entry = 0;
let best = 0;
let entries = 0;
let lastExit = -10000;
let exiting = false;
await runBars({
  onBatch(state, batch) {
    const bar = batch.bars.find(b => b.symbol === 'CBBTC');
    if (!bar) return [];
    const price = Number(bar.c);
    closes.push(price);
    if (closes.length > 91) closes.shift();
    const i = batch.seq;
    const position = state.positions.get('CBBTC');
    for (const fill of batch.fills) {
      if (fill.symbol !== 'CBBTC' || fill.status !== 'filled') continue;
      if (fill.side === 'buy') {
        entry = Number(position?.cost ?? 0n) / Number(position?.qty ?? 1n);
        const spec = state.symbols.get('CBBTC')!;
        entry *= 10 ** (spec.qty_scale + spec.price_scale - state.hello.capital.quote_scale);
        best = 0;
        entries++;
      } else {
        lastExit = i;
        exiting = false;
        entry = 0;
      }
    }
    if (position && entry > 0) {
      const gain = (price / entry - 1) * 10000;
      best = Math.max(best, gain);
      if (gain >= 150 || gain <= -80 || (best >= 80 && gain <= best - 50)) exiting = true;
      if (exiting) return [{ side: 'sell', symbol: 'CBBTC', qty: position.qty, max_slippage_bps: 100 }];
      return [];
    }
    if (state.warmingUp || closes.length < 91 || entries >= 2 || i - lastExit < 90) return [];
    const recent = closes.slice(-91);
    let peak = recent[0];
    let dip = 0;
    for (const close of recent) {
      peak = Math.max(peak, close);
      dip = Math.min(dip, (close / peak - 1) * 10000);
    }
    const bounce = (price / closes[closes.length - 16] - 1) * 10000;
    if (dip <= -120 && bounce >= 40 && state.cash >= 1000000n) {
      return [{ side: 'buy', symbol: 'CBBTC', notional_quote_units: state.cash, max_slippage_bps: 100 }];
    }
    return [];
  }
});
