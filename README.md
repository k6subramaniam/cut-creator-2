# ✂️ Cut Creator 2

**Toronto's Premium Cut Studio — Street Meets Sophisticated**

A single-page React application for a high-end urban barbershop, blending a gritty street aesthetic with a premium, high-discipline studio vibe.

![Dark Mode](https://img.shields.io/badge/theme-dark%20mode-0B0B0C?style=flat-square&labelColor=0B0B0C)
![React 19](https://img.shields.io/badge/React-19-00FFD1?style=flat-square&logo=react&logoColor=00FFD1&labelColor=0B0B0C)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-00FFD1?style=flat-square&logo=tailwindcss&logoColor=00FFD1&labelColor=0B0B0C)

---

## Features

### 🎯 Smart Booking System
- Dynamic availability with Busy Indicator (weekday vs weekend patterns)
- Smart pre-filling from the Look Picker quiz
- Google Calendar link + downloadable `.ICS` file generation

### 🧙 Look Picker Wizard
- 3-step gamified modal: Base → Vibe → Detail
- Service, style, hair length, and add-on selection
- Auto-redirects to booking with preferences locked in

### 📊 Live Busy Logic
- Recharts bar chart showing shop traffic throughout the day
- Weekday vs Weekend toggle with different data patterns
- Real-time "NOW" indicator based on system clock

### 🖱️ Interactive Hero
- Scrub/drag interaction revealing Before → After transformation

### 🖼️ Gallery
- Masonry grid layout with tag-based filtering
- "Book This Style" hover conversion on every image

### 📄 Pages
| Page | Description |
|------|-------------|
| **Home** | Hero, Top 3 services, Look Picker CTA, Staff roster, Reviews, Location |
| **Services** | Full menu with pricing, duration, category filters |
| **Gallery** | Visual portfolio with tag filtering |
| **About** | Brand story, FAQ accordion, Google Maps embed |
| **Book** | Primary conversion point with smart form |

---

## Design System

| Element | Value |
|---------|-------|
| Background | `#0B0B0C` (Dark Mode) |
| Text | `#F4F1EA` (Cream) |
| Accent | `#00FFD1` (Electric Teal) |
| Headings | **Anton** (Bold, uppercase, industrial) |
| Body | **Inter** (Clean, readable) |
| Accents | **JetBrains Mono** (Technical, code-like) |
| Texture | Custom SVG noise filter (film grain) |

---

## Tech Stack

- **React 19** — UI framework
- **Vite** — Build tool
- **Tailwind CSS** — Utility styling
- **Recharts** — Busy indicator charts
- **Lucide React** — Icons

---

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## License

MIT

---

Built with 🖤 in Toronto.
