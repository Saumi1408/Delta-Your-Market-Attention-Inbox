# Engineering trade-offs

| Decision | Choice and why | Cost / evolution |
|---|---|---|
| Architecture | Modular monolith: strong package boundaries with one deployable | Extract ingestion and attention only when load demands it |
| Updates | SSE: traffic is server → client, HTTP-native and reconnectable | WebSockets only if two-way low-latency interaction appears |
| Primary store | PostgreSQL: transactions and relationship queries fit checkpoints/watchlists | Add time-series storage for deep tick history later |
| Scoring | Deterministic rules: testable, explainable, cannot invent facts | Tune weights from outcomes; ML may rank verified signals later |
| Cache | Redis is an optimization, never truth | Cache misses increase latency but do not corrupt state |
| Market integration | Provider interface rather than vendor calls in business logic | Small interface cost buys testability and fallback freedom |
| Baseline | Per-stock acknowledgement checkpoint | More rows than `last_login`, but correctly models user knowledge |
| Calculation | On-demand in the slice | Precompute on market events for very large active watchlists |

The project intentionally avoids microservices and an LLM. Neither improves the core hackathon risk: trustworthy user-relative change detection.
