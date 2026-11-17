import { runBars } from './vendor/makefun-bars.ts';

const LOOKBACK = 30;
const DIP_BPS = 55;
const BOUNCE_BARS = 3;
const BOUNCE_BPS = 9;
const STOP_BPS = 60;
const TRAIL_ARM_BPS = 150;
const TRAIL_BPS = 7;
const COOLDOWN = 30;
const closes: number[] = [];
let entryPrice = 0;
let bestGain = 0;
let lastExit = -10000;
let exitPending = false;

await runBars({
  onBatch(state, batch) {
    const bar = batch.bars.find(b => b.symbol === 'CBBTC');
    if (!bar) return [];
    const close = Number(bar.c);
    closes.push(close);
    if (closes.length > LOOKBACK + 1) closes.shift();
    const position = state.positions.get('CBBTC');
    for (const fill of batch.fills) {
      if (fill.symbol !== 'CBBTC' || fill.status !== 'filled') continue;
      if (fill.side === 'buy' && position) {
        const spec = state.symbols.get('CBBTC')!;
        entryPrice = Number(position.cost) / Number(position.qty)
          * 10 ** (spec.qty_scale + spec.price_scale - state.hello.capital.quote_scale);
        bestGain = 0;
      } else if (fill.side === 'sell') {
        lastExit = batch.seq;
        entryPrice = 0;
        exitPending = false;
      }
    }
    if (position && entryPrice > 0) {
      const gain = (close / entryPrice - 1) * 10000;
      bestGain = Math.max(bestGain, gain);
      if (gain <= -STOP_BPS ||
          (bestGain >= TRAIL_ARM_BPS && gain <= bestGain - TRAIL_BPS)) exitPending = true;
      return exitPending
        ? [{ side: 'sell', symbol: 'CBBTC', qty: position.qty, max_slippage_bps: 100 }]
        : [];
    }
    if (state.warmingUp || closes.length < LOOKBACK + 1 ||
        batch.seq - lastExit < COOLDOWN) return [];
    const dip = (close / Math.max(...closes) - 1) * 10000;
    const bounce = (close / closes[closes.length - 1 - BOUNCE_BARS] - 1) * 10000;
    const spend = state.cash < state.weightRoom('CBBTC') ? state.cash : state.weightRoom('CBBTC');
    if (dip <= -DIP_BPS && bounce >= BOUNCE_BPS &&
        spend >= BigInt(state.hello.fees.min_notional_quote_units)) {
      return [{ side: 'buy', symbol: 'CBBTC', notional_quote_units: spend, max_slippage_bps: 100 }];
    }
    return [];
  }
});
