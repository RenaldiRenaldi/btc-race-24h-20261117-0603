# BTC Race v6

[![make.fun · btc-race-24h-20261117-0603](https://make.fun/badge/btc-race-24h-20261117-0603.svg)](https://make.fun/bounty/btc-race-24h-20261117-0603?utm_source=github&utm_medium=readme&utm_campaign=btc-race-24h-20261117-0603)
[![rank](https://make.fun/badge/btc-race-24h-20261117-0603/RenaldiRenaldi/btc-race-24h-20261117-0603/rank.svg)](https://make.fun/bounty/btc-race-24h-20261117-0603/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=btc-race-24h-20261117-0603)
[![reward](https://make.fun/badge/btc-race-24h-20261117-0603/RenaldiRenaldi/btc-race-24h-20261117-0603/reward.svg)](https://make.fun/bounty/btc-race-24h-20261117-0603?utm_source=github&utm_medium=readme&utm_campaign=btc-race-24h-20261117-0603)

[Bounty](https://make.fun/bounty/btc-race-24h-20261117-0603)

A deterministic Node 22, standard-library-only cbBTC recovery strategy using
`agent-fun/bars-replay/v1`. Signals use observed closes; fills arrive at the
next open. No timestamps, bar targets, future prices, network or randomness
are used to select trades.

Buy a 55-bps decline from the highest close in the preceding 30 minutes
when the last three minutes recover at least 9 bps. Also enter on a 25-bps
decline from the preceding 15-minute high when the latest minute recovers
at least 10 bps. Spend available cash within the position cap. Exit at a
60-bps loss relative to fee-inclusive entry cost. The primary signal trails
the best close by 7 bps after a 150-bps gain; secondary entries trail by
5 bps after a 50-bps gain. Wait 30 bars after an exit. There is no daily trade-count limit
and no fixed profit cap. Rejected exits are retried. Warm-up bars build
history but cannot trigger orders.

Independent measurement of the supplied dev window found 1,440 bars,
+48.8539 bps total return, a 249.3154-bps range, +3,108.4917 bps summed
positive minute returns and -3,056.7781 bps summed negative returns.
Fifteen-minute returns exceeded +50 bps 61 times and fell below -50 bps
49 times. Execution modelling included next-open latency, fees, slippage
and each open’s recorded depth. Small-dip candidates with frequent exits
often lost their advantage to costs; stronger recovery confirmation and
a wider profit activation preserved the larger recoveries.

Parameters were selected on this one published window. Multiple settings
produced the same leading trade sequence; this is a local stability check,
not evidence of profitability on unseen data. Gaps and next-open latency
can exceed the nominal stop. The parent handles bundling and submission.

Local kit grade: **+39.926214 USDC net PnL**, **0.7506995% maximum
drawdown**, 8 strategy fills plus the end-of-window liquidation (four
completed round trips), and zero rejections. At doubled fees the same
actions returned **+36.616173 USDC**. Action hash:
`d82f0862f0a449cfc0602e6bdc552aa64fa66c094fbefe4a30666c80c9177a37`.
The baseline v4 grade was +35.334425 USDC. This result is +4.591789 USDC
above v4 but remains below the $50 target.

Measured candidate comparisons (approximate float simulation, next-open
fills and recorded depth, before integer rounding):

| Dip rule | Bounce | Trail arm / distance | Stop | Net USDC | Round trips |
| --- | --- | --- | --- | ---: | ---: |
| 10m peak, 20 bps | 10 bps from 3m low | 80 / 15 bps | 80 bps | 24.67 | 4 |
| 30m peak, 60 bps | 8 bps over 3m | 80 / 10 bps | 60 bps | 31.09 | 3 |
| 20m peak, 45 bps | 8 bps over 1m | 60 / 5 bps | 60 bps | 34.07 | 4 |
| 30m peak, 55 bps | 9 bps over 3m | 150 / 7 bps | 60 bps | 35.34 | 3 |

The final sequence also appeared with 30m/60-bps dips, 3m/8-bps bounces,
150-bps activation, 5-bps trails and 80-bps stops. These comparisons
explain selection on dev; no bar numbers enter the strategy. The $32
threshold is a development target, not a guaranteed future rank.

Reproduce from a clean committed checkout:

```sh
node /path/to/kit/cli/makefun.mjs grade-local --kit /path/to/kit \
  --bot . --driver process --save /tmp/btc-v4-grade --json
```

The process driver used Node v24.22.1; the kit reports harness Node
v26.13.1. This is an advisory local grade. Transcript eligibility and the
server grade are checked on the parent's final bundle. No submission
was made by this build.
