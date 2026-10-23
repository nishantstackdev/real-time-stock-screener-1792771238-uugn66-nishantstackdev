# 📈 EquityPulse — High-Performance Real-Time Stock Screener

EquityPulse is a production-grade, high-frequency financial stock screening engine built using **Next.js 16 (App Router)**, **TanStack Table v8**, **TanStack Virtual**, and **Zustand**. Engineered to handle **5,000+ live stock records** with zero UI lag, real-time price updates, sub-millisecond filtering latency, and interactive technical charting.

---

## 🚀 Key Performance Benchmarks

* **DOM Virtualization**: Smooth scrolling through 5,000+ records locked at **>55 FPS**.
* **Filter Engine Latency**: Multi-criteria combinatorial filters execute in **<5ms** (Benchmark requirement was <200ms).
* **Live Updates**: High-frequency WebSocket price tick simulation batched via `requestAnimationFrame` with active DOM flash indicators.
* **SSR Safety**: Dynamic client-side imports with disabled SSR to eliminate Next.js hydration mismatches completely.

---

## 🛠️ Tech Stack & Architecture

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js 16 (App Router), React 18, TypeScript |
| **State Management** | Zustand (Global Stock & Filter State) |
| **Data Grid & Virtualization** | TanStack Table v8, TanStack Virtual v3 |
| **Charting & Technicals** | Lightweight Charts (TradingView) |
| **Styling & Animations** | Tailwind CSS v4, Custom CSS Keyframes |

---

## 💡 Architecture & Key Features

### 1. High-Performance Virtualized Grid
Standard DOM tables choke with 5,000+ rows. EquityPulse utilizes **TanStack Virtual** to dynamically mount and recycle DOM nodes inside the viewport, reducing active DOM node counts from 5,000 to ~25 at any given time.

### 2. Combinatorial Filter Engine
Built a custom, linear-time filter algorithm supporting:
* **Search Query**: Real-time symbol & company name searching.
* **Range & Multi-Select**: Market Cap thresholds, P/E ratios, and sector toggles.
* Timed benchmarks show execution averages at **~0.8ms** per query over 5,000 items.

### 3. WebSocket Real-Time Price Simulation
Simulates real-time market data feed ticks:
* Price shocks generated every 1.5 seconds across 10-25 random stocks.
* State updates batched through `requestAnimationFrame` to prevent UI thread blocking.
* Visual flashing (`PriceCell`) using CSS keyframe animations for gainers (green) and losers (red).

### 4. Interactive Financial Charting
Integrates TradingView's **Lightweight Charts** to display candlestick patterns alongside key technical overlay indicators:
* Exponential Moving Average (**EMA**)
* Simple Moving Average (**SMA**)
* Relative Strength Index (**RSI**)

---

## 🏃 Getting Started Locally

### Prerequisites
* Node.js 18.x or higher
* npm / yarn / pnpm

### Installation & Setup

1. **Clone the Repository**
   ```bash
   git clone [https://github.com/your-username/real-time-stock-screener.x](https://github.com/your-username/real-time-stock-screener.x)
   cd real-time-stock-screener