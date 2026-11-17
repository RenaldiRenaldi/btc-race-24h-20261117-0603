# BTC Race v4

[![make.fun · btc-race-24h-20261117-0603](https://make.fun/badge/btc-race-24h-20261117-0603.svg)](https://make.fun/bounty/btc-race-24h-20261117-0603?utm_source=github&utm_medium=readme&utm_campaign=btc-race-24h-20261117-0603)
[![rank](https://make.fun/badge/btc-race-24h-20261117-0603/RenaldiRenaldi/btc-race-24h-20261117-0603/rank.svg)](https://make.fun/bounty/btc-race-24h-20261117-0603/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=btc-race-24h-20261117-0603)
[![reward](https://make.fun/badge/btc-race-24h-20261117-0603/RenaldiRenaldi/btc-race-24h-20261117-0603/reward.svg)](https://make.fun/bounty/btc-race-24h-20261117-0603?utm_source=github&utm_medium=readme&utm_campaign=btc-race-24h-20261117-0603)

[Bounty](https://make.fun/bounty/btc-race-24h-20261117-0603)

A deterministic Node 22, standard-library-only cbBTC recovery strategy using
`agent-fun/bars-replay/v1`. Signals use observed closes; fills arrive at the
next open. No timestamps, bar targets, future prices, network or randomness
are used to select trades.

Buy a 55-bps decline from the highest close in the preceding 30 minutes
when the last three minutes recover at least 9 bps. Spend available cash
within the position cap. Exit at a 60-bps loss relative to fee-inclusive
entry cost, or trail the best close by 7 bps once marked gain reaches
150 bps. Wait 30 bars after an exit. There is no daily trade-count limit
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
can exceed the nominal stop. Official local grade results are recorded
below after validation. The parent handles bundling and submission.
