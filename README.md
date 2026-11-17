# BTC Race v3

[![make.fun · btc-race-24h-20261117-0603](https://make.fun/badge/btc-race-24h-20261117-0603.svg)](https://make.fun/bounty/btc-race-24h-20261117-0603?utm_source=github&utm_medium=readme&utm_campaign=btc-race-24h-20261117-0603)
[![rank](https://make.fun/badge/btc-race-24h-20261117-0603/RenaldiRenaldi/btc-race-24h-20261117-0603/rank.svg)](https://make.fun/bounty/btc-race-24h-20261117-0603/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=btc-race-24h-20261117-0603)
[![reward](https://make.fun/badge/btc-race-24h-20261117-0603/RenaldiRenaldi/btc-race-24h-20261117-0603/reward.svg)](https://make.fun/bounty/btc-race-24h-20261117-0603?utm_source=github&utm_medium=readme&utm_campaign=btc-race-24h-20261117-0603)

A deterministic Node 22 cbBTC/USDC dip recovery bot using agent-fun/bars-replay/v1.
The SDK handles hello, batch, orders, account updates and done. Only observed
closes, batch sequence and the account determine decisions; there is no clock, network or randomness.

The 1,440-bar dev window returned 48.85 bps with a 249.32 bps range and
211.89 bps maximum drawdown. No 90-minute return was below -200 bps.
A peak-to-subsequent-trough decline of at least 120 bps in the last 90 minutes plus a 40 bps 15-minute
recovery triggers a full-cash entry. At most two entries are allowed, with
90 bars of cooldown. Exit at 150 bps net-of-entry-cost marked gain, -80 bps
loss, or a 50 bps trail after reaching 80 bps. Every order limits slippage
to 100 bps. Failed exits are retried; failed entries require a continuing signal.

One quiet dev window cannot establish future profitability. A $50 target
is not supported by this window's few broad moves after transaction costs.

The history buffer holds only 91 closes. A decline must precede its trough;
a rising range alone does not qualify. The 80 bps loss stop also triggers
before the proposed 150 bps hard stop would be needed. Gaps and refused
orders can still exceed a nominal stop. The strategy never uses bar indices
as entry targets or embeds future prices.

Final local harness grade (process driver): net PnL +15.412958 USDC;
4 filled orders (2 completed round trips), 0 rejections; maximum drawdown
0.8253544%; net PnL at doubled fees +13.792326 USDC. Both executions
matched, with action hash
039d59e825834d5f898bb3b47e12b1071c38e04150c0e756277607cc01f5d37b.
The local harness used Node v24.22.1 versus the kit's v26.13.1;
process grading is advisory, and transcript eligibility is checked on the
parent's final bundle. No competition submission was made here.
