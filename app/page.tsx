'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Bell,
  Check,
  ChevronDown,
  ChevronRight,
  Clock3,
  Database,
  Eye,
  HeartPulse,
  Layers3,
  Menu,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Wifi,
  X,
} from 'lucide-react';

type Quality = 'LIVE' | 'DELAYED' | 'STALE' | 'CONFLICTED' | 'UNAVAILABLE';
type Level = 'NEEDS ATTENTION' | 'WORTH WATCHING' | 'QUIET';
type Stock = {
  id: string;
  name: string;
  symbol: string;
  price: number;
  since: number;
  score: number;
  level: Level;
  quality: Quality;
  updated: string;
  lastSeen: string;
  normal: number;
  volume: number;
  benchmark: string;
  benchmarkMove: number;
  reasons: string[];
};

const initial: Stock[] = [
  {
    id: 'tata',
    name: 'Tata Motors',
    symbol: 'TATAMOTORS',
    price: 663.2,
    since: -6.8,
    score: 83,
    level: 'NEEDS ATTENTION',
    quality: 'LIVE',
    updated: '14 sec ago',
    lastSeen: 'Mon, 10:32',
    normal: 2.4,
    volume: 2.1,
    benchmark: 'Nifty Auto',
    benchmarkMove: -0.7,
    reasons: [
      '2.4× its normal movement',
      'Volume is 2.1× recent average',
      '5.9% weaker than Nifty Auto',
    ],
  },
  {
    id: 'infy',
    name: 'Infosys',
    symbol: 'INFY',
    price: 1481.4,
    since: 4.2,
    score: 67,
    level: 'NEEDS ATTENTION',
    quality: 'LIVE',
    updated: '11 sec ago',
    lastSeen: 'Tue, 15:08',
    normal: 1.9,
    volume: 1.6,
    benchmark: 'Nifty IT',
    benchmarkMove: 1.1,
    reasons: [
      '1.9× its normal movement',
      'Volume is 1.6× recent average',
      'Outperformed Nifty IT by 3.1%',
    ],
  },
  {
    id: 'hdfc',
    name: 'HDFC Bank',
    symbol: 'HDFCBANK',
    price: 1694.8,
    since: -2.6,
    score: 46,
    level: 'WORTH WATCHING',
    quality: 'DELAYED',
    updated: '15 min delayed',
    lastSeen: 'Yesterday, 12:44',
    normal: 1.3,
    volume: 1.4,
    benchmark: 'Nifty Bank',
    benchmarkMove: -0.9,
    reasons: [
      '1.3× its normal movement',
      'Volume is 1.4× recent average',
      '1.7% weaker than Nifty Bank',
    ],
  },
  {
    id: 'reliance',
    name: 'Reliance Industries',
    symbol: 'RELIANCE',
    price: 2954.1,
    since: 1.2,
    score: 34,
    level: 'WORTH WATCHING',
    quality: 'LIVE',
    updated: '9 sec ago',
    lastSeen: 'Wed, 11:20',
    normal: 0.9,
    volume: 1.2,
    benchmark: 'Nifty 50',
    benchmarkMove: 0.5,
    reasons: [
      'Movement is slightly above normal',
      'Volume is 1.2× recent average',
    ],
  },
  {
    id: 'tcs',
    name: 'Tata Consultancy Services',
    symbol: 'TCS',
    price: 3942.6,
    since: 0.4,
    score: 18,
    level: 'QUIET',
    quality: 'LIVE',
    updated: '18 sec ago',
    lastSeen: 'Yesterday, 15:42',
    normal: 0.5,
    volume: 0.9,
    benchmark: 'Nifty IT',
    benchmarkMove: 0.3,
    reasons: ['Movement remains within its usual range'],
  },
  {
    id: 'sbin',
    name: 'State Bank of India',
    symbol: 'SBIN',
    price: 812.3,
    since: -0.7,
    score: 12,
    level: 'QUIET',
    quality: 'LIVE',
    updated: '16 sec ago',
    lastSeen: 'Tue, 13:10',
    normal: 0.6,
    volume: 0.8,
    benchmark: 'Nifty Bank',
    benchmarkMove: -0.5,
    reasons: ['No unusual price or volume movement'],
  },
];

const qclass = (q: Quality) => `quality ${q.toLowerCase()}`;
const API = 'http://localhost:8080/api';
function Score({ value }: { value: number }) {
  const color = value >= 60 ? '#db4b38' : value >= 30 ? '#ad6d00' : '#1b7b5a';
  return (
    <span
      className="score"
      style={{
        background: `conic-gradient(${color} ${value * 3.6}deg,#e9eeeb 0)`,
      }}
    >
      <b>{value}</b>
    </span>
  );
}

function OpeningIntro({ onDone }: { onDone: () => void }) {
  return (
    <main className="opening" aria-label="Delta is preparing your market catch-up">
      <button className="opening-skip" type="button" onClick={onDone}>
        Skip intro
      </button>
      <section className="opening-content">
        <div className="delta-simulation" aria-hidden="true">
          <span className="orbit orbit-one" />
          <span className="orbit orbit-two" />
          <span className="signal-dot dot-one" />
          <span className="signal-dot dot-two" />
          <span className="signal-dot dot-three" />
          <i>Δ</i>
        </div>
        <p className="opening-kicker">DELTA MARKET INTELLIGENCE</p>
        <h1>Catch up on what changed.</h1>
        <div className="opening-status" aria-live="polite">
          <span>Reading your checkpoints</span>
          <span>Filtering ordinary movement</span>
          <span>Your attention inbox is ready</span>
        </div>
        <div className="opening-progress" aria-hidden="true"><i /></div>
      </section>
    </main>
  );
}

export default function Home() {
  const [stocks, setStocks] = useState(initial),
    [nav, setNav] = useState<'attention' | 'watchlists' | 'explore' | 'status'>(
      'attention',
    ),
    [selected, setSelected] = useState<Stock | null>(null),
    [quietOpen, setQuietOpen] = useState(false),
    [mobile, setMobile] = useState(false),
    [scenario, setScenario] = useState('Stock-specific fall'),
    [refreshing, setRefreshing] = useState(false),
    [refreshNotice, setRefreshNotice] = useState(''),
    [showIntro, setShowIntro] = useState(true);
  useEffect(() => {
    const timer = window.setTimeout(() => setShowIntro(false), 4500);
    return () => window.clearTimeout(timer);
  }, []);
  const counts = useMemo(
    () => ({
      attention: stocks.filter((s) => s.level === 'NEEDS ATTENTION').length,
      watching: stocks.filter((s) => s.level === 'WORTH WATCHING').length,
      quiet: stocks.filter((s) => s.level === 'QUIET').length,
    }),
    [stocks],
  );
  const acknowledge = (id: string) => {
    const s = stocks.find((x) => x.id === id);
    if (s)
      fetch(`${API}/instruments/${s.symbol}/acknowledge`, {
        method: 'POST',
      }).catch(() => {});
    setStocks((v) =>
      v.map((s) =>
        s.id === id
          ? {
              ...s,
              since: 0,
              score: 0,
              level: 'QUIET',
              lastSeen: 'Just now',
              reasons: ['Checkpoint updated — no new movement yet'],
            }
          : s,
      ),
    );
    setSelected(null);
  };
  const scenarioChange = (v: string) => {
    setScenario(v);
    fetch(
      `${API}/dev/scenarios/${v === 'Stale provider' ? 'STALE_DATA' : v === 'Conflicting providers' ? 'CONFLICTED_DATA' : v === 'Normal market' ? 'NORMAL' : 'STOCK_SPECIFIC_FALL'}`,
      { method: 'POST' },
    ).catch(() => {});
    if (v === 'Stale provider')
      setStocks(
        initial.map((s) =>
          s.id === 'tata'
            ? {
                ...s,
                quality: 'STALE',
                updated: 'Last reliable update 8 min ago',
              }
            : s,
        ),
      );
    else if (v === 'Conflicting providers')
      setStocks(
        initial.map((s) =>
          s.id === 'tata'
            ? {
                ...s,
                quality: 'CONFLICTED',
                updated: 'Showing last verified value',
              }
            : s,
        ),
      );
    else setStocks(initial);
  };
  const refreshMarketData = async () => {
    if (refreshing) return;
    setRefreshing(true);
    setRefreshNotice('Refreshing market data');
    try {
      const response = await fetch(`${API}/system/health`, {
        cache: 'no-store',
      });
      if (!response.ok) throw new Error('Refresh failed');
      scenarioChange(scenario);
      setRefreshNotice('Market data refreshed');
    } catch {
      setRefreshNotice('Refresh failed. Existing verified data is unchanged.');
    } finally {
      setRefreshing(false);
    }
  };
  if (showIntro) return <OpeningIntro onDone={() => setShowIntro(false)} />;
  return (
    <div className="shell">
      <aside className={mobile ? 'side open' : 'side'}>
        <div className="brand">
          <i>Δ</i> DELTA{' '}
          <button onClick={() => setMobile(false)}>
            <X />
          </button>
        </div>
        <p>Catch up on what changed.</p>
        <nav>
          <button
            className={nav === 'attention' ? 'active' : ''}
            onClick={() => {
              setNav('attention');
              setMobile(false);
            }}
          >
            <Bell />
            Attention <b>{counts.attention + counts.watching}</b>
          </button>
          <button
            className={nav === 'watchlists' ? 'active' : ''}
            onClick={() => {
              setNav('watchlists');
              setMobile(false);
            }}
          >
            <Layers3 />
            Watchlists
          </button>
          <button
            className={nav === 'explore' ? 'active' : ''}
            onClick={() => {
              setNav('explore');
              setMobile(false);
            }}
          >
            <Search />
            Explore stocks
          </button>
          <button
            className={nav === 'status' ? 'active' : ''}
            onClick={() => {
              setNav('status');
              setMobile(false);
            }}
          >
            <HeartPulse />
            Data status
          </button>
        </nav>
        <section className="lists">
          <label>
            WATCHLISTS <Plus />
          </label>
          <button className="chosen">
            ● Core holdings <small>{stocks.length}</small>
          </button>
        </section>
        <section className="scenario">
          <label>
            <Sparkles /> DEMO SCENARIO
          </label>
          <select
            value={scenario}
            onChange={(e) => scenarioChange(e.target.value)}
          >
            <option>Stock-specific fall</option>
            <option>Normal market</option>
            <option>Stale provider</option>
            <option>Conflicting providers</option>
          </select>
          <small>Simulated market data</small>
        </section>
        <div className="user">
          <i>SK</i>
          <span>
            <b>Saumiya</b>
            <small>demo@delta.app</small>
          </span>
        </div>
      </aside>
      <main>
        <header>
          <button className="menu" onClick={() => setMobile(true)}>
            <Menu />
          </button>
          <span className="market">
            <i /> <b>MARKET OPEN</b>
            <small>NSE · Closes 3:30 PM</small>
          </span>
          <span className="actions">
            <button
              type="button"
              aria-label="Search and explore stocks"
              title="Search stocks"
              onClick={() => setNav('explore')}
            >
              <Search aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label={refreshing ? 'Refreshing market data' : 'Refresh market data'}
              title="Refresh market data"
              onClick={refreshMarketData}
              disabled={refreshing}
            >
              <RefreshCw
                aria-hidden="true"
                className={refreshing ? 'spin' : ''}
              />
            </button>
            <b>SIMULATED DATA</b>
            <span className="sr-only" role="status" aria-live="polite">
              {refreshNotice}
            </span>
          </span>
        </header>
        {nav === 'attention' ? (
          <Attention
            stocks={stocks}
            counts={counts}
            open={setSelected}
            acknowledge={acknowledge}
            quietOpen={quietOpen}
            setQuietOpen={setQuietOpen}
          />
        ) : nav === 'watchlists' ? (
          <Watchlists stocks={stocks} open={setSelected} />
        ) : nav === 'explore' ? (
          <Explore />
        ) : (
          <Status stocks={stocks} />
        )}
      </main>
      {selected && (
        <Detail
          stock={selected}
          close={() => setSelected(null)}
          acknowledge={() => acknowledge(selected.id)}
        />
      )}
    </div>
  );
}

function Intro({
  children,
  action,
}: {
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <section className="intro">
      <div>{children}</div>
      {action}
    </section>
  );
}
function Attention({
  stocks,
  counts,
  open,
  acknowledge,
  quietOpen,
  setQuietOpen,
}: {
  stocks: Stock[];
  counts: { attention: number; watching: number; quiet: number };
  open: (s: Stock) => void;
  acknowledge: (id: string) => void;
  quietOpen: boolean;
  setQuietOpen: (v: boolean) => void;
}) {
  const active = stocks
      .filter((s) => s.level !== 'QUIET')
      .sort((a, b) => b.score - a.score),
    quiet = stocks.filter((s) => s.level === 'QUIET');
  return (
    <div className="content">
      <Intro
        action={
          <button
            className="outline"
            onClick={() => active.forEach((s) => acknowledge(s.id))}
          >
            <Check />
            Mark all reviewed
          </button>
        }
      >
        <em>FRIDAY, 4 SEPTEMBER</em>
        <h1>Welcome back, Saumiya.</h1>
        <p>
          You were away for <b>3 days.</b> Here’s the signal without the noise.
        </p>
      </Intro>
      <section className="summary">
        <Metric
          n={counts.attention}
          label="Need attention"
          sub="Meaningful change"
          kind="red"
        />
        <Metric
          n={counts.watching}
          label="Worth watching"
          sub="Notable, not urgent"
          kind="amber"
        />
        <Metric
          n={counts.quiet}
          label="Stayed quiet"
          sub="Nothing unusual"
          kind="green"
        />
        <div className="filtered">
          <ShieldCheck />
          <span>
            <b>
              Only {counts.attention + counts.watching} of {stocks.length}{' '}
              surfaced
            </b>
            <small>Delta filters ordinary movement.</small>
          </span>
        </div>
      </section>
      <div className="section-head">
        <span>
          <i /> <b>Your attention inbox</b> <small>{active.length}</small>
        </span>
        <p>Ranked by meaningful change since your last check</p>
      </div>
      <div className="cards">
        {active.map((s) => (
          <Card
            key={s.id}
            s={s}
            open={() => open(s)}
            acknowledge={() => acknowledge(s.id)}
          />
        ))}
      </div>
      <button className="quiet-toggle" onClick={() => setQuietOpen(!quietOpen)}>
        <span>
          <Check />
          <i>
            <b>{quiet.length} stocks stayed quiet</b>
            <small>No movement outside their normal range</small>
          </i>
        </span>
        <ChevronDown className={quietOpen ? 'up' : ''} />
      </button>
      {quietOpen && (
        <div className="quiet-list">
          {quiet.map((s) => (
            <button key={s.id} onClick={() => open(s)}>
              <span>
                <b>{s.name}</b>
                <small>{s.symbol}</small>
              </span>
              <strong>₹{s.price.toLocaleString('en-IN')}</strong>
              <em>{s.since}%</em>
              <i>QUIET · {s.score}</i>
            </button>
          ))}
        </div>
      )}
      <footer>
        <ShieldCheck />
        Delta explains market movement. It does not provide investment advice.
      </footer>
    </div>
  );
}
function Metric({
  n,
  label,
  sub,
  kind,
}: {
  n: number;
  label: string;
  sub: string;
  kind: string;
}) {
  return (
    <div className="metric">
      <strong className={kind}>{n}</strong>
      <span>
        <b>{label}</b>
        <small>{sub}</small>
      </span>
    </div>
  );
}
function Card({
  s,
  open,
  acknowledge,
}: {
  s: Stock;
  open: () => void;
  acknowledge: () => void;
}) {
  return (
    <article className="card">
      <div className="card-top">
        <Company s={s} />
        <span className="level">
          <i className={s.score >= 60 ? 'red' : 'amber'}>{s.level}</i>
          <Score value={s.score} />
        </span>
      </div>
      <div className="price">
        <span>
          <b>
            ₹{s.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </b>
          <em className={s.since < 0 ? 'down' : 'up'}>
            {s.since > 0 ? '+' : ''}
            {s.since}% <small>since you last checked</small>
          </em>
        </span>
        <Activity />
      </div>
      <section className="reasons">
        <label>WHY IT MATTERS</label>
        {s.reasons.map((r, i) => (
          <div key={r}>
            <i>{i + 1}</i>
            <span>{r}</span>
            <b>+{i === 0 ? 31 : i === 1 ? 18 : 14}</b>
          </div>
        ))}
      </section>
      {(s.quality === 'STALE' || s.quality === 'CONFLICTED') && (
        <div className="warning">
          <AlertTriangle />
          {s.quality === 'STALE'
            ? 'Provider unavailable. Showing the last reliable quote.'
            : 'Providers disagree. Showing the last verified value.'}
        </div>
      )}
      <div className="card-foot">
        <span>
          <i className={qclass(s.quality)}>{s.quality}</i>
          <small>{s.updated}</small>
          <small>Last checked {s.lastSeen}</small>
        </span>
        <span>
          <button onClick={acknowledge}>
            <Eye />
            Mark seen
          </button>
          <button className="story-btn" onClick={open}>
            View change story
            <ChevronRight />
          </button>
        </span>
      </div>
    </article>
  );
}
function Company({ s }: { s: Stock }) {
  return (
    <span className="company">
      <i>{s.symbol.slice(0, 2)}</i>
      <span>
        <b>{s.name}</b>
        <small>{s.symbol} · NSE</small>
      </span>
    </span>
  );
}

function Detail({
  stock: s,
  close,
  acknowledge,
}: {
  stock: Stock;
  close: () => void;
  acknowledge: () => void;
}) {
  const bars = [78, 72, 68, 60, 54, 47, 42, 35];
  return (
    <div
      className="overlay"
      onMouseDown={(e) => e.target === e.currentTarget && close()}
    >
      <section className="detail">
        <button className="close" onClick={close}>
          <X />
        </button>
        <div className="detail-head">
          <Company s={s} />
          <Score value={s.score} />
        </div>
        <div className="detail-price">
          <span>
            <small>CURRENT PRICE</small>
            <b>
              ₹{s.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </b>
          </span>
          <span>
            <small>SINCE LAST SEEN</small>
            <b className={s.since < 0 ? 'down' : 'up'}>
              {s.since > 0 ? '+' : ''}
              {s.since}%
            </b>
          </span>
          <i className={qclass(s.quality)}>{s.quality}</i>
        </div>
        <section className="story">
          <label>THE CHANGE STORY</label>
          <h2>
            {s.name} has {s.since < 0 ? 'fallen' : 'risen'} {Math.abs(s.since)}%
            since you last checked.
          </h2>
          <p>
            The move is <b>{s.normal}× larger</b> than its typical movement over
            the same duration. Trading volume is <b>{s.volume}× normal</b>,
            while {s.benchmark} is {s.benchmarkMove < 0 ? 'down' : 'up'} only{' '}
            {Math.abs(s.benchmarkMove)}%.
          </p>
          <div className="mini-chart" aria-label="Compact price chart">
            <span className="baseline">YOU LAST CHECKED</span>
            {bars.map((h, i) => (
              <i key={i} style={{ height: `${h}%` }} />
            ))}
            <b>NOW</b>
          </div>
        </section>
        <section className="timeline">
          <label>CHANGE TIMELINE</label>
          <Timeline
            time={s.lastSeen}
            title="You last checked"
            value="Your knowledge checkpoint"
          />
          <Timeline
            time="Tuesday, 14:21"
            title="Unusual trading volume detected"
            value={`${s.volume}× recent average`}
          />
          <Timeline
            time="Today, 15:30"
            title="Meaningful price movement detected"
            value={`Current price ₹${s.price.toFixed(2)}`}
          />
        </section>
        <button className="ack" onClick={acknowledge}>
          <Eye />
          I’ve seen this — update my checkpoint
        </button>
        <p className="note">
          Auto-refresh never changes what you know. Only acknowledgement resets
          the baseline.
        </p>
      </section>
    </div>
  );
}
function Timeline({
  time,
  title,
  value,
}: {
  time: string;
  title: string;
  value: string;
}) {
  return (
    <div>
      <i />
      <span>
        <small>{time}</small>
        <b>{title}</b>
        <em>{value}</em>
      </span>
    </div>
  );
}
function Watchlists({
  stocks,
  open,
}: {
  stocks: Stock[];
  open: (s: Stock) => void;
}) {
  const [lists, setLists] = useState<
      { id: number; name: string; instruments: string[] }[]
    >([]),
    [name, setName] = useState(''),
    [message, setMessage] = useState('');
  const load = () =>
    fetch(`${API}/watchlists`)
      .then((r) => r.json())
      .then(setLists)
      .catch(() =>
        setMessage('Backend unavailable — showing deterministic demo data.'),
      );
  useEffect(() => {
    void load();
  }, []);
  const create = async () => {
    if (!name.trim()) return;
    await fetch(`${API}/watchlists`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    setName('');
    load();
  };
  const rename = async () => {
    if (!lists[0] || !name.trim()) return;
    await fetch(`${API}/watchlists/${lists[0].id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    setName('');
    load();
  };
  const remove = async (symbol: string) => {
    if (!lists[0]) return;
    await fetch(`${API}/watchlists/${lists[0].id}/stocks/${symbol}`, {
      method: 'DELETE',
    });
    load();
  };
  const deleteList = async () => {
    if (!lists[0] || !confirm(`Delete ${lists[0].name}?`)) return;
    await fetch(`${API}/watchlists/${lists[0].id}`, { method: 'DELETE' });
    load();
  };
  return (
    <div className="content">
      <Intro
        action={
          <div className="watch-actions">
            <input
              placeholder="New or updated name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button className="outline" onClick={create}>
              <Plus />
              Create
            </button>
            <button className="outline" onClick={rename}>
              Rename
            </button>
            <button className="outline danger" onClick={deleteList}>
              Delete
            </button>
          </div>
        }
      >
        <em>YOUR COLLECTIONS</em>
        <h1>{lists[0]?.name || 'Core holdings'}</h1>
        <p>
          {lists[0]?.instruments.length ?? stocks.length} stocks · persisted in
          the backend database
        </p>
      </Intro>
      {message && (
        <div className="warning">
          <AlertTriangle />
          {message}
        </div>
      )}
      <div className="table">
        <div>
          <b>Instrument</b>
          <b>Price</b>
          <b>Since seen</b>
          <b>Attention</b>
          <b>Manage</b>
        </div>
        {stocks
          .filter((s) => !lists[0] || lists[0].instruments.includes(s.symbol))
          .map((s) => (
            <div className="stock-row" key={s.id}>
              <button onClick={() => open(s)}>
                <Company s={s} />
              </button>
              <span>₹{s.price.toLocaleString('en-IN')}</span>
              <span className={s.since < 0 ? 'down' : 'up'}>{s.since}%</span>
              <span>
                {s.level} · {s.score}
              </span>
              <button className="remove-stock" onClick={() => remove(s.symbol)}>
                Remove
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}
type ExploreResult = {
  instrument: {
    id: string;
    symbol: string;
    companyName: string;
    sector: string;
    benchmarkSymbol: string;
  };
  quote: { price: number; qualityStatus: Quality; exchangeTimestamp: string };
};
function Explore() {
  const [query, setQuery] = useState(''),
    [results, setResults] = useState<ExploreResult[]>([]),
    [lists, setLists] = useState<
      { id: number; name: string; instruments: string[] }[]
    >([]),
    [message, setMessage] = useState('');
  useEffect(() => {
    fetch(`${API}/instruments/search?q=`)
      .then((r) => r.json())
      .then(setResults)
      .catch(() =>
        setMessage('Start the backend to search verified instruments.'),
      );
    fetch(`${API}/watchlists`)
      .then((r) => r.json())
      .then(setLists)
      .catch(() => {});
  }, []);
  const search = () =>
    fetch(`${API}/instruments/search?q=${encodeURIComponent(query)}`)
      .then((r) => r.json())
      .then(setResults)
      .catch(() => setMessage('Search is temporarily unavailable.'));
  const add = async (id: string) => {
    if (!lists[0]) return setMessage('Create a watchlist first.');
    await fetch(`${API}/watchlists/${lists[0].id}/stocks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ instrumentId: id }),
    });
    setMessage(
      `${id} added to ${lists[0].name}. Its initial checkpoint is now set.`,
    );
  };
  return (
    <div className="content">
      <Intro>
        <em>EXPLORE VERIFIED INSTRUMENTS</em>
        <h1>Find a stock.</h1>
        <p>
          Structured simulated facts only—no predictions, recommendations, or
          invented news.
        </p>
      </Intro>
      <div className="explore-search">
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && search()}
          placeholder="Search company or NSE symbol"
        />
        <button onClick={search}>
          <Search />
          Search
        </button>
      </div>
      {message && <div className="explore-message">{message}</div>}
      <div className="explore-grid">
        {results.map((r) => (
          <article key={r.instrument.id}>
            <Company
              s={{
                ...initial[0],
                name: r.instrument.companyName,
                symbol: r.instrument.symbol,
              }}
            />
            <div>
              <span>
                <small>CURRENT PRICE</small>
                <b>₹{r.quote.price.toLocaleString('en-IN')}</b>
              </span>
              <i className={qclass(r.quote.qualityStatus)}>
                {r.quote.qualityStatus}
              </i>
            </div>
            <p>
              {r.instrument.sector} · Compared with{' '}
              {r.instrument.benchmarkSymbol}
            </p>
            <button onClick={() => add(r.instrument.id)}>
              <Plus />
              Add to watchlist
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}
function Status({ stocks }: { stocks: Stock[] }) {
  const bad = stocks.filter(
    (s) =>
      s.quality === 'STALE' ||
      s.quality === 'CONFLICTED' ||
      s.quality === 'UNAVAILABLE',
  ).length;
  return (
    <div className="content">
      <Intro
        action={
          <span className="healthy">
            <Wifi />
            {bad ? 'DEGRADED' : 'ALL SYSTEMS HEALTHY'}
          </span>
        }
      >
        <em>SYSTEM HEALTH</em>
        <h1>Data you can trust.</h1>
        <p>Freshness and degraded states are shown, never hidden.</p>
      </Intro>
      <div className="status-grid">
        <Health
          icon={<Activity />}
          label="Market feed"
          value={bad ? 'Degraded' : 'Healthy'}
          note="Last successful ingestion 7 sec ago"
        />
        <Health
          icon={<Database />}
          label="PostgreSQL"
          value="Healthy"
          note="Primary store · 18 ms"
        />
        <Health
          icon={<Layers3 />}
          label="Redis cache"
          value="Healthy"
          note="Optional cache · 3 ms"
        />
        <Health
          icon={<Clock3 />}
          label="Stale instruments"
          value={String(bad)}
          note={
            bad
              ? 'Last-known-good values in use'
              : 'All quotes within threshold'
          }
        />
      </div>
      <section className="guide">
        <h2>Quality status guide</h2>
        {(
          ['LIVE', 'DELAYED', 'STALE', 'CONFLICTED', 'UNAVAILABLE'] as Quality[]
        ).map((q) => (
          <div key={q}>
            <i className={qclass(q)}>{q}</i>
            <span>
              <b>
                {q === 'LIVE'
                  ? 'Fresh exchange timestamp'
                  : q === 'DELAYED'
                    ? 'Provider-declared delay'
                    : q === 'STALE'
                      ? 'Last-known-good value'
                      : q === 'CONFLICTED'
                        ? 'Providers disagree'
                        : 'No reliable value available'}
              </b>
              <small>
                {q === 'CONFLICTED'
                  ? 'No silent provider selection'
                  : q === 'UNAVAILABLE'
                    ? 'Price is withheld instead of guessed'
                    : 'The UI states exactly how current this value is'}
              </small>
            </span>
          </div>
        ))}
      </section>
    </div>
  );
}
function Health({
  icon,
  label,
  value,
  note,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  note: string;
}) {
  return (
    <section className="health">
      {icon}
      <small>{label}</small>
      <b>{value}</b>
      <p>{note}</p>
    </section>
  );
}
