# Edge cases

- **Market closed / holiday:** expose `CLOSED` through an exchange-calendar abstraction and label the last close, never live. The slice models the boundary; a production NSE calendar remains.
- **Away for months:** cap elapsed-volatility calculations and use split/dividend-adjusted history before scoring.
- **Insufficient history / newly added:** create the initial checkpoint and show “building a baseline,” not a fabricated anomaly.
- **Delisting:** retain history, disable new quotes, and label the instrument unavailable.
- **Corporate actions:** rebase checkpoints using provider adjustment factors before calculating returns.
- **Missing volume:** omit the signal and contribution; do not treat missing as zero.
- **Stale / outage:** return last-known-good with `STALE`; never a blank dashboard.
- **Provider conflict:** preserve the last verified value and set `CONFLICTED`.
- **Duplicates:** fingerprint instrument + event type + exchange timestamp before persistence.
- **Out of order:** reject updates whose exchange timestamp is not newer; implemented and tested.
- **Redis failure:** read provider/PostgreSQL; correctness remains intact.
- **Database outage:** serve only explicitly labelled cached read state; block acknowledgements safely.
- **Delete/re-add:** create a fresh baseline unless a product retention policy explicitly restores the old one.
- **Two devices:** acknowledgement is a transactional server write; the latest committed checkpoint wins and streams to both devices.
- **Timezone:** store UTC instants; render in the user/exchange timezone.
- **Very large lists:** paginate, precompute active attention, and collapse quiet results server-side.
