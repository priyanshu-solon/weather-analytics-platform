# 🛰️ Weather Intel | Advanced Analytics Platform

**Weather Intel** is a high-performance weather intelligence dashboard built with the **Next.js 16 App Router**. It provides real-time atmospheric data, 24-hour trend analysis, and a global "Intelligence Network" for tracking multiple locations simultaneously.



## 🚀 Technical Core
* **Framework:** Next.js 16 (React)
* **Language:** TypeScript (Strict Mode)
* **Styling:** Tailwind CSS + Lucide Icons
* **Data Visualization:** Recharts (SVG-based)
* **Backend:** Next.js Route Handlers + MongoDB (MERN Stack)
* **Geocoding:** OpenStreetMap Nominatim API

## 💎 Key Features

### 1. Global Intelligence Search
* **Search-as-you-type:** Real-time city suggestions with country-level context.
* **Debounced API Requests:** Implemented a 600ms debounce logic to optimize network traffic and comply with API usage policies.
* **Error Resilience:** Built-in validation to prevent UI crashes on invalid location queries.

### 2. Multi-Metric Analytics
* **Atmospheric Trends:** A dynamic multi-line chart tracking Temperature, Precipitation Probability, and Wind Speed over a 24-hour window.
* **Reactive Unit Conversion:** Instant toggle between Metric (°C) and Imperial (°F) units using lifted state management—no additional API calls required.
* **Smart Insights:** Weather-code-driven UI themes that adapt the background gradient based on local conditions.



### 3. Intelligence Network (MERN)
* **Pinned Locations:** Securely save frequently monitored cities to a MongoDB database.
* **Full CRUD Operations:** Seamlessly add and remove cities from your personalized tracking network.

## 🛠️ Installation & Setup

1. **Clone the Repository:**
   ```bash
   git clone [https://github.com/priyanshu-solon/weather-analytics-platform.git](https://github.com/priyanshu-solon/weather-analytics-platform.git)
   cd weather-analytics-platform
