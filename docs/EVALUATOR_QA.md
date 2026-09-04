# Evaluator Q&A

**Why is this not a normal watchlist?** A quote list is global and present-tense. Delta compares global market state with what each user last intentionally acknowledged for each stock, then suppresses normal movement.

**What is meaningful change?** A capped weighted combination of movement relative to expected volatility for the elapsed period, volume/volatility anomalies, benchmark-relative movement, and a range breakout.

**Why not percentage thresholds?** Three percent is exceptional for one instrument and ordinary for another. Normalizing by elapsed-period behavior makes the result contextual.

**Why not AI?** Importance must be deterministic, reproducible and auditable. Generated prose could misstate financial facts; Delta formats verified structured values.

**Why modular monolith, PostgreSQL and Redis?** One deployable reduces operational risk, PostgreSQL protects relationship/checkpoint consistency, and Redis accelerates global latest-quote reads without becoming truth.

**What if Redis or the provider fails?** Redis failure falls through to the database/provider. Provider failure returns the last known good record as `STALE`. Neither is silently represented as live.

**What if providers disagree?** Delta marks `CONFLICTED` and shows the last verified value rather than quietly picking whichever response arrived last.

**Why SSE?** The dominant flow is one-way updates. SSE is simpler HTTP infrastructure with automatic reconnection.

**How does this reach one million users?** Ingest once per instrument, stream instrument-keyed changes, and evaluate only affected user relationships. Checkpoints are sharded by user and attention inboxes are materialized asynchronously.

**Why per-stock last-seen?** Viewing Tata Motors tells us nothing about whether the user knows what changed in Infosys. A single login timestamp destroys that distinction.

**How do two devices remain consistent?** Checkpoints are server-side transactional writes. Both devices receive the committed update via SSE; auto-refresh is read-only.

**What would another month add?** A licensed provider, adjusted price history, an NSE calendar, persistent repositories, fallback/circuit-breaker telemetry, and end-to-end tests—before more visual features.

**Likely first failure?** External market data rate limits or latency. The provider boundary, global ingestion, cache, last-known-good record and explicit quality status isolate that risk.

**How is misleading information prevented?** No recommendations or predictions; timestamp-derived freshness, conflict states, deterministic reasons, simulated-data labels, and no silent fallback.
