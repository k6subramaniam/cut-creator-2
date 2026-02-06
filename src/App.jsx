import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, ReferenceLine } from "recharts";
import { Scissors, Clock, MapPin, Phone, Star, ChevronDown, ChevronRight, X, Calendar, Download, Instagram, Menu, ArrowRight, Sparkles, Users, Award, Check, Filter, Heart, Mail, Zap } from "lucide-react";

// ─── FONTS ───
const fontLink = document.createElement("link");
fontLink.href = "https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

// ─── GLOBAL STYLES ───
const styleEl = document.createElement("style");
styleEl.textContent = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #0B0B0C; color: #F4F1EA; font-family: 'Inter', sans-serif; overflow-x: hidden; }
  .font-anton { font-family: 'Anton', sans-serif; letter-spacing: 0.02em; }
  .font-mono { font-family: 'JetBrains Mono', monospace; }
  .bg-dark { background: #0B0B0C; }
  .bg-dark-card { background: #111113; }
  .bg-dark-elevated { background: #1A1A1D; }
  .text-cream { color: #F4F1EA; }
  .text-cream-muted { color: #9A978F; }
  .text-teal { color: #00FFD1; }
  .bg-teal { background: #00FFD1; }
  .border-teal { border-color: #00FFD1; }
  .ring-teal { --tw-ring-color: #00FFD1; }

  .bg-grain {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 9999; opacity: 0.035;
  }

  @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes slideIn { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes pulse-teal { 0%, 100% { box-shadow: 0 0 0 0 rgba(0,255,209,0.4); } 50% { box-shadow: 0 0 0 8px rgba(0,255,209,0); } }
  @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }

  .anim-slideUp { animation: slideUp 0.6s ease-out forwards; }
  .anim-slideIn { animation: slideIn 0.5s ease-out forwards; }
  .anim-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
  .pulse-teal { animation: pulse-teal 2s infinite; }

  .scrub-container { position: relative; overflow: hidden; cursor: col-resize; }
  .scrub-overlay { position: absolute; top: 0; left: 0; height: 100%; overflow: hidden; border-right: 2px solid #00FFD1; }
  .scrub-line { position: absolute; top: 0; right: -1px; width: 2px; height: 100%; background: #00FFD1; box-shadow: 0 0 12px #00FFD1; }

  .masonry { columns: 2; column-gap: 16px; }
  @media (min-width: 768px) { .masonry { columns: 3; } }
  .masonry > * { break-inside: avoid; margin-bottom: 16px; }

  .modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.85); z-index: 100; display: flex; align-items: center; justify-content: center; animation: fadeIn 0.2s ease; }
  .modal-content { background: #111113; border: 1px solid #222; border-radius: 16px; max-width: 520px; width: 92%; max-height: 90vh; overflow-y: auto; animation: slideUp 0.35s ease-out; }

  .busy-bar { transition: all 0.3s ease; }
  .busy-bar:hover { filter: brightness(1.3); }

  input, select, textarea {
    background: #1A1A1D !important; border: 1px solid #333 !important; color: #F4F1EA !important;
    padding: 12px 16px; border-radius: 8px; font-family: 'Inter', sans-serif; font-size: 14px; width: 100%; outline: none;
    transition: border-color 0.2s;
  }
  input:focus, select:focus, textarea:focus { border-color: #00FFD1 !important; }
  select option { background: #1A1A1D; color: #F4F1EA; }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: #0B0B0C; }
  ::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: #00FFD1; }

  .marquee-track { display: flex; width: max-content; animation: marquee 20s linear infinite; }

  a, button { transition: all 0.2s ease; }
`;
document.head.appendChild(styleEl);

// ─── CONSTANTS / DATA ───
const SERVICES = [
  { id: "mens-cut", name: "Men's Cut", price: 45, duration: 45, category: "Men's", bestFor: ["All hair types", "Weekly maintenance"], description: "Precision cut with consultation, hot towel finish, and styled to perfection." },
  { id: "skin-fade", name: "Skin Fade", price: 50, duration: 50, category: "Men's", bestFor: ["Short styles", "Clean look"], description: "Zero to hero gradient with surgical precision. Includes lineup." },
  { id: "buzz-cut", name: "Buzz Cut", price: 30, duration: 25, category: "Men's", bestFor: ["Low maintenance", "Summer ready"], description: "Quick, clean, and sharp. Multiple guard options available." },
  { id: "lineup", name: "Lineup / Edge Up", price: 20, duration: 20, category: "Men's", bestFor: ["Between cuts", "Event prep"], description: "Crisp edges and defined hairline. Razor-precise." },
  { id: "beard-trim", name: "Beard Sculpt", price: 30, duration: 30, category: "Men's", bestFor: ["Full beards", "Shaping"], description: "Full beard sculpting with hot towel treatment and oil finish." },
  { id: "kids-cut", name: "Kids Cut", price: 30, duration: 30, category: "Kids", bestFor: ["Ages 3-12", "Patient service"], description: "Fun, patient service for the little ones. Includes a treat." },
  { id: "perm", name: "Perm / Texture", price: 85, duration: 90, category: "Perm", bestFor: ["Curls", "Volume", "K-style"], description: "Modern perm techniques for natural-looking curls and waves." },
  { id: "design", name: "Hair Design", price: 15, duration: 15, category: "Add-On", bestFor: ["Custom art", "Statement looks"], description: "Custom razor designs and patterns. Add to any cut." },
  { id: "royal", name: "The Royal Treatment", price: 90, duration: 75, category: "Men's", bestFor: ["Special occasions", "VIP experience"], description: "Cut + beard + hot towel shave + scalp massage + styling." },
];

const BARBERS = [
  { id: "jay", name: "Jay Montoya", role: "Founder / Lead Barber", specialty: "Fades & Designs", available: true, rating: 4.9, cuts: "12K+", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face" },
  { id: "marcus", name: "Marcus Chen", role: "Senior Barber", specialty: "Perms & Texture", available: true, rating: 4.8, cuts: "8K+", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face" },
  { id: "dani", name: "Dani Rivera", role: "Barber / Stylist", specialty: "Modern Classics", available: false, rating: 4.7, cuts: "5K+", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face" },
];

const REVIEWS = [
  { name: "Alex T.", rating: 5, text: "Best fade in the city. Jay is an absolute artist. Been coming here for 2 years straight.", date: "2 weeks ago" },
  { name: "Chris M.", rating: 5, text: "The vibe is unmatched. Clean shop, skilled barbers, and the booking system is seamless.", date: "1 month ago" },
  { name: "Priya S.", rating: 5, text: "Got my son's first real haircut here. They were so patient and he actually loved it!", date: "3 weeks ago" },
  { name: "DeShawn K.", rating: 4, text: "Solid lineup every time. Marcus knows exactly what I want before I say it.", date: "1 month ago" },
  { name: "Tomás R.", rating: 5, text: "The Royal Treatment is worth every dollar. I walked out feeling like a different person.", date: "2 months ago" },
];

const GALLERY_IMAGES = [
  { id: 1, url: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600&h=750&fit=crop", tags: ["Fade", "Lineup"], title: "Clean Skin Fade" },
  { id: 2, url: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&h=500&fit=crop", tags: ["Fade", "Design"], title: "Fade + Design" },
  { id: 3, url: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&h=700&fit=crop", tags: ["Perm", "Texture"], title: "Modern Perm" },
  { id: 4, url: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&h=600&fit=crop", tags: ["Classic", "Beard"], title: "Classic + Beard" },
  { id: 5, url: "https://images.unsplash.com/photo-1593702288056-7927b442d0fa?w=600&h=800&fit=crop", tags: ["Fade", "Bold"], title: "High Top Fade" },
  { id: 6, url: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=600&h=550&fit=crop", tags: ["Lineup", "Clean"], title: "Precision Lineup" },
  { id: 7, url: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=600&h=650&fit=crop", tags: ["Kids", "Fade"], title: "Kids Fade" },
  { id: 8, url: "https://images.unsplash.com/photo-1521119989659-a83eee488004?w=600&h=700&fit=crop", tags: ["Classic", "Clean"], title: "Gentleman's Cut" },
];

const WEEKDAY_DATA = [
  { hour: "9AM", busy: 15 }, { hour: "10AM", busy: 25 }, { hour: "11AM", busy: 40 },
  { hour: "12PM", busy: 55 }, { hour: "1PM", busy: 45 }, { hour: "2PM", busy: 35 },
  { hour: "3PM", busy: 50 }, { hour: "4PM", busy: 75 }, { hour: "5PM", busy: 90 },
  { hour: "6PM", busy: 85 }, { hour: "7PM", busy: 60 }, { hour: "8PM", busy: 30 },
];

const WEEKEND_DATA = [
  { hour: "9AM", busy: 55 }, { hour: "10AM", busy: 70 }, { hour: "11AM", busy: 85 },
  { hour: "12PM", busy: 90 }, { hour: "1PM", busy: 80 }, { hour: "2PM", busy: 75 },
  { hour: "3PM", busy: 80 }, { hour: "4PM", busy: 85 }, { hour: "5PM", busy: 70 },
  { hour: "6PM", busy: 55 }, { hour: "7PM", busy: 40 }, { hour: "8PM", busy: 20 },
];

const FAQ_DATA = [
  { q: "Do I need an appointment?", a: "Walk-ins are welcome, but we strongly recommend booking online to guarantee your spot. Our barbers stay busy — especially on weekends." },
  { q: "What's your cancellation policy?", a: "We ask for at least 4 hours notice. Life happens — just let us know. Repeated no-shows may require a deposit for future bookings." },
  { q: "Do you take card or just cash?", a: "We accept all major cards, Apple Pay, Google Pay, and cash. Whatever's easiest for you." },
  { q: "Is parking available?", a: "Street parking is available on Queen St. There's also a Green P lot on the next block. TTC streetcar stop is right outside." },
  { q: "What products do you use?", a: "We use a curated mix of Layrite, Baxter of California, and our own house-blend beard oil. All products are available for purchase." },
];

// ─── UTILITY FUNCTIONS ───
function getCurrentHourLabel() {
  const h = new Date().getHours();
  if (h < 9 || h > 20) return null;
  const ampm = h >= 12 ? "PM" : "AM";
  const hour12 = h > 12 ? h - 12 : h;
  return `${hour12}${ampm}`;
}

function generateICS(date, time, service, barber) {
  const [year, month, day] = date.split("-");
  const [hours, minutes] = time.split(":");
  const start = `${year}${month}${day}T${hours}${minutes}00`;
  const endH = String(Number(hours) + 1).padStart(2, "0");
  const end = `${year}${month}${day}T${endH}${minutes}00`;
  return `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nDTSTART:${start}\nDTEND:${end}\nSUMMARY:Cut Creator 2 — ${service}\nDESCRIPTION:Barber: ${barber}\\nService: ${service}\\nSee you at the shop!\nLOCATION:Cut Creator 2, 742 Queen St W, Toronto\nATTENDEE;CN=Cut Creator 2:mailto:booking.cutcreator2@gmail.com\nEND:VEVENT\nEND:VCALENDAR`;
}

function generateGoogleCalLink(date, time, service, barber) {
  const [year, month, day] = date.split("-");
  const [hours, minutes] = time.split(":");
  const start = `${year}${month}${day}T${hours}${minutes}00`;
  const endH = String(Number(hours) + 1).padStart(2, "0");
  const end = `${year}${month}${day}T${endH}${minutes}00`;
  const details = encodeURIComponent(`Barber: ${barber}\nService: ${service}\nSee you at the shop!`);
  const location = encodeURIComponent("Cut Creator 2, 742 Queen St W, Toronto, ON");
  const title = encodeURIComponent(`Cut Creator 2 — ${service}`);
  return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}&add=booking.cutcreator2@gmail.com`;
}

// ─── NOISE GRAIN SVG ───
function GrainOverlay() {
  return (
    <svg className="bg-grain" xmlns="http://www.w3.org/2000/svg">
      <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /></filter>
      <rect width="100%" height="100%" filter="url(#grain)" />
    </svg>
  );
}

// ─── NAVIGATION ───
function Nav({ currentPage, setCurrentPage }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [
    { key: "home", label: "Home" },
    { key: "services", label: "Services" },
    { key: "gallery", label: "Gallery" },
    { key: "about", label: "About" },
  ];

  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, background: "rgba(11,11,12,0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid #1A1A1D" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        <button onClick={() => { setCurrentPage("home"); window.scrollTo(0,0); }} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
          <Scissors size={22} color="#00FFD1" />
          <span className="font-anton" style={{ fontSize: 20, color: "#F4F1EA", textTransform: "uppercase" }}>Cut Creator <span style={{ color: "#00FFD1" }}>2</span></span>
        </button>

        {/* Desktop */}
        <div style={{ display: "flex", alignItems: "center", gap: 32 }} className="desktop-nav">
          {links.map(l => (
            <button key={l.key} onClick={() => { setCurrentPage(l.key); window.scrollTo(0,0); }}
              style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500, color: currentPage === l.key ? "#00FFD1" : "#9A978F", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "'Inter', sans-serif" }}>
              {l.label}
            </button>
          ))}
          <button onClick={() => { setCurrentPage("book"); window.scrollTo(0,0); }}
            style={{ background: "#00FFD1", color: "#0B0B0C", border: "none", padding: "10px 24px", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "'Inter', sans-serif" }}>
            Book Now
          </button>
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: "none", border: "none", cursor: "pointer", display: "none" }} className="mobile-toggle">
          {menuOpen ? <X size={24} color="#F4F1EA" /> : <Menu size={24} color="#F4F1EA" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ background: "#111113", borderTop: "1px solid #222", padding: "16px 24px" }} className="mobile-menu">
          {links.map(l => (
            <button key={l.key} onClick={() => { setCurrentPage(l.key); setMenuOpen(false); window.scrollTo(0,0); }}
              style={{ display: "block", width: "100%", textAlign: "left", background: "none", border: "none", cursor: "pointer", padding: "12px 0", fontSize: 15, color: currentPage === l.key ? "#00FFD1" : "#F4F1EA", fontFamily: "'Inter', sans-serif", borderBottom: "1px solid #1A1A1D" }}>
              {l.label}
            </button>
          ))}
          <button onClick={() => { setCurrentPage("book"); setMenuOpen(false); window.scrollTo(0,0); }}
            style={{ display: "block", width: "100%", marginTop: 12, background: "#00FFD1", color: "#0B0B0C", border: "none", padding: "14px", borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: "pointer", textTransform: "uppercase", fontFamily: "'Inter', sans-serif" }}>
            Book Now
          </button>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
        @media (min-width: 769px) {
          .mobile-menu { display: none !important; }
        }
      `}</style>
    </nav>
  );
}

// ─── BUSY INDICATOR ───
function BusyIndicator({ isWeekend, setIsWeekend }) {
  const data = isWeekend ? WEEKEND_DATA : WEEKDAY_DATA;
  const currentHour = getCurrentHourLabel();

  return (
    <div style={{ background: "#111113", borderRadius: 16, padding: "24px 20px", border: "1px solid #1A1A1D" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <p className="font-mono" style={{ fontSize: 11, color: "#00FFD1", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>Live Busy Indicator</p>
          <p style={{ fontSize: 13, color: "#9A978F" }}>{isWeekend ? "Weekend" : "Weekday"} traffic pattern</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setIsWeekend(false)}
            style={{ padding: "6px 14px", borderRadius: 6, fontSize: 12, fontWeight: 600, border: "1px solid", cursor: "pointer", fontFamily: "'Inter', sans-serif",
              background: !isWeekend ? "#00FFD1" : "transparent", color: !isWeekend ? "#0B0B0C" : "#9A978F", borderColor: !isWeekend ? "#00FFD1" : "#333" }}>
            Weekday
          </button>
          <button onClick={() => setIsWeekend(true)}
            style={{ padding: "6px 14px", borderRadius: 6, fontSize: 12, fontWeight: 600, border: "1px solid", cursor: "pointer", fontFamily: "'Inter', sans-serif",
              background: isWeekend ? "#00FFD1" : "transparent", color: isWeekend ? "#0B0B0C" : "#9A978F", borderColor: isWeekend ? "#00FFD1" : "#333" }}>
            Weekend
          </button>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={data} barCategoryGap="20%">
          <XAxis dataKey="hour" tick={{ fill: "#666", fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }} axisLine={false} tickLine={false} />
          <YAxis hide domain={[0, 100]} />
          {currentHour && <ReferenceLine x={currentHour} stroke="#00FFD1" strokeDasharray="3 3" label={{ value: "NOW", fill: "#00FFD1", fontSize: 9, fontFamily: "'JetBrains Mono', monospace", position: "top" }} />}
          <Bar dataKey="busy" radius={[4, 4, 0, 0]} className="busy-bar">
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.busy > 70 ? "#FF4D4D" : entry.busy > 40 ? "#FFB800" : "#00FFD1"} fillOpacity={entry.hour === currentHour ? 1 : 0.6} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div style={{ display: "flex", gap: 16, marginTop: 12, justifyContent: "center" }}>
        {[{ color: "#00FFD1", label: "Low" }, { color: "#FFB800", label: "Moderate" }, { color: "#FF4D4D", label: "Busy" }].map(l => (
          <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: l.color }} />
            <span style={{ fontSize: 11, color: "#666" }}>{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── LOOK PICKER MODAL ───
function LookPicker({ isOpen, onClose, onComplete }) {
  const [step, setStep] = useState(0);
  const [choices, setChoices] = useState({ base: "", vibe: "", length: "", addons: [] });

  if (!isOpen) return null;

  const steps = [
    {
      title: "Pick Your Base",
      subtitle: "What service are you looking for?",
      options: [
        { value: "Men's", icon: "✂️", label: "Men's Cut", desc: "Classic precision" },
        { value: "Kids", icon: "🧒", label: "Kids Cut", desc: "Patient & fun" },
        { value: "Perm", icon: "🌀", label: "Perm / Texture", desc: "Curls & waves" },
      ],
      field: "base",
    },
    {
      title: "Set The Vibe",
      subtitle: "What's your style energy?",
      options: [
        { value: "Clean", icon: "💎", label: "Clean", desc: "Minimal, sharp" },
        { value: "Bold", icon: "🔥", label: "Bold", desc: "Statement making" },
        { value: "Classic", icon: "👔", label: "Classic", desc: "Timeless look" },
      ],
      field: "vibe",
      extraField: {
        label: "Hair Length",
        field: "length",
        options: ["Short", "Medium", "Long"],
      },
    },
    {
      title: "Add Details",
      subtitle: "Any extras? (optional)",
      options: [
        { value: "Design", icon: "🎨", label: "Hair Design", desc: "+$15" },
        { value: "Shave", icon: "🪒", label: "Hot Shave", desc: "+$25" },
        { value: "Beard", icon: "🧔", label: "Beard Sculpt", desc: "+$30" },
      ],
      field: "addons",
      multi: true,
    },
  ];

  const current = steps[step];

  const handleSelect = (field, value, multi) => {
    if (multi) {
      setChoices(prev => ({
        ...prev,
        [field]: prev[field].includes(value)
          ? prev[field].filter(v => v !== value)
          : [...prev[field], value],
      }));
    } else {
      setChoices(prev => ({ ...prev, [field]: value }));
    }
  };

  const canNext = current.field === "addons" || choices[current.field];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ padding: 0 }}>
        {/* Header */}
        <div style={{ padding: "24px 24px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div className="font-mono" style={{ fontSize: 11, color: "#00FFD1", marginBottom: 4 }}>STEP {step + 1} OF 3</div>
            <h3 className="font-anton" style={{ fontSize: 28, color: "#F4F1EA", textTransform: "uppercase" }}>{current.title}</h3>
            <p style={{ fontSize: 14, color: "#9A978F", marginTop: 4 }}>{current.subtitle}</p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}><X size={20} color="#666" /></button>
        </div>

        {/* Progress */}
        <div style={{ display: "flex", gap: 4, padding: "16px 24px", marginBottom: 4 }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= step ? "#00FFD1" : "#333", transition: "background 0.3s" }} />
          ))}
        </div>

        {/* Options */}
        <div style={{ padding: "0 24px 8px", display: "flex", flexDirection: "column", gap: 10 }}>
          {current.options.map(opt => {
            const selected = current.multi
              ? choices[current.field].includes(opt.value)
              : choices[current.field] === opt.value;
            return (
              <button key={opt.value} onClick={() => handleSelect(current.field, opt.value, current.multi)}
                style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: 10, border: `1px solid ${selected ? "#00FFD1" : "#333"}`,
                  background: selected ? "rgba(0,255,209,0.08)" : "#1A1A1D", cursor: "pointer", textAlign: "left", transition: "all 0.2s" }}>
                <span style={{ fontSize: 24 }}>{opt.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: "#F4F1EA", fontSize: 15 }}>{opt.label}</div>
                  <div style={{ fontSize: 12, color: "#9A978F" }}>{opt.desc}</div>
                </div>
                {selected && <Check size={18} color="#00FFD1" />}
              </button>
            );
          })}
        </div>

        {/* Extra field for step 2 */}
        {current.extraField && (
          <div style={{ padding: "8px 24px 0" }}>
            <label style={{ fontSize: 12, color: "#9A978F", display: "block", marginBottom: 8 }}>{current.extraField.label}</label>
            <div style={{ display: "flex", gap: 8 }}>
              {current.extraField.options.map(o => (
                <button key={o} onClick={() => setChoices(prev => ({ ...prev, [current.extraField.field]: o }))}
                  style={{ flex: 1, padding: "10px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Inter', sans-serif",
                    border: `1px solid ${choices[current.extraField.field] === o ? "#00FFD1" : "#333"}`,
                    background: choices[current.extraField.field] === o ? "rgba(0,255,209,0.08)" : "#1A1A1D",
                    color: choices[current.extraField.field] === o ? "#00FFD1" : "#9A978F" }}>
                  {o}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ padding: "20px 24px 24px", display: "flex", gap: 10 }}>
          {step > 0 && (
            <button onClick={() => setStep(step - 1)}
              style={{ flex: 1, padding: "14px", borderRadius: 10, border: "1px solid #333", background: "transparent", color: "#F4F1EA", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'Inter', sans-serif" }}>
              Back
            </button>
          )}
          <button onClick={() => {
            if (step < 2) setStep(step + 1);
            else onComplete(choices);
          }} disabled={!canNext}
            style={{ flex: 2, padding: "14px", borderRadius: 10, border: "none", background: canNext ? "#00FFD1" : "#333", color: canNext ? "#0B0B0C" : "#666", fontSize: 14, fontWeight: 700, cursor: canNext ? "pointer" : "not-allowed", fontFamily: "'Inter', sans-serif" }}>
            {step < 2 ? "Next" : "Book This Look →"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── HERO SCRUB ───
function HeroScrub() {
  const containerRef = useRef(null);
  const [pos, setPos] = useState(50);

  const handleMove = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    setPos(x);
  }, []);

  return (
    <div ref={containerRef} className="scrub-container" style={{ width: "100%", height: 420, borderRadius: 16, userSelect: "none" }}
      onMouseMove={e => handleMove(e.clientX)}
      onTouchMove={e => handleMove(e.touches[0].clientX)}>
      {/* Before */}
      <img src="https://images.unsplash.com/photo-1521119989659-a83eee488004?w=1200&h=800&fit=crop" alt="Before"
        style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(100%) brightness(0.5)" }} />
      {/* After overlay */}
      <div className="scrub-overlay" style={{ width: `${pos}%` }}>
        <img src="https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=1200&h=800&fit=crop" alt="After"
          style={{ width: containerRef.current ? containerRef.current.offsetWidth : "100vw", height: "100%", objectFit: "cover", filter: "brightness(0.85) contrast(1.1)" }} />
        <div className="scrub-line" />
      </div>
      {/* Labels */}
      <div style={{ position: "absolute", bottom: 20, left: 20 }} className="font-mono">
        <span style={{ background: "rgba(0,0,0,0.7)", padding: "4px 10px", borderRadius: 4, fontSize: 11, color: "#9A978F" }}>BEFORE</span>
      </div>
      <div style={{ position: "absolute", bottom: 20, right: 20 }} className="font-mono">
        <span style={{ background: "rgba(0,255,209,0.15)", padding: "4px 10px", borderRadius: 4, fontSize: 11, color: "#00FFD1", border: "1px solid rgba(0,255,209,0.3)" }}>AFTER</span>
      </div>
      {/* Drag hint */}
      <div style={{ position: "absolute", top: "50%", left: `${pos}%`, transform: "translate(-50%, -50%)", background: "#00FFD1", width: 40, height: 40, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 20px rgba(0,255,209,0.4)" }}>
        <span style={{ fontSize: 16 }}>⇔</span>
      </div>
    </div>
  );
}

// ─── FAQ ACCORDION ───
function FAQAccordion() {
  const [open, setOpen] = useState(null);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {FAQ_DATA.map((item, i) => (
        <div key={i} style={{ borderBottom: "1px solid #1A1A1D" }}>
          <button onClick={() => setOpen(open === i ? null : i)}
            style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 0", background: "none", border: "none", cursor: "pointer", color: "#F4F1EA", fontSize: 15, fontWeight: 500, textAlign: "left", fontFamily: "'Inter', sans-serif" }}>
            {item.q}
            <ChevronDown size={18} color="#9A978F" style={{ transform: open === i ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.3s" }} />
          </button>
          {open === i && (
            <div style={{ paddingBottom: 18, fontSize: 14, color: "#9A978F", lineHeight: 1.7 }} className="anim-fadeIn">{item.a}</div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── SECTION WRAPPER ───
function Section({ children, style = {} }) {
  return <section style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px", ...style }}>{children}</section>;
}
function SectionLabel({ children }) {
  return <div className="font-mono" style={{ fontSize: 11, color: "#00FFD1", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 8 }}>{children}</div>;
}
function SectionTitle({ children }) {
  return <h2 className="font-anton" style={{ fontSize: "clamp(32px, 5vw, 52px)", textTransform: "uppercase", lineHeight: 1.05, color: "#F4F1EA", marginBottom: 16 }}>{children}</h2>;
}

// ─── HOME PAGE ───
function HomePage({ setCurrentPage, setBookingPrefs }) {
  const [pickerOpen, setPickerOpen] = useState(false);

  return (
    <>
      {/* Hero */}
      <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "100px 24px 60px", maxWidth: 1200, margin: "0 auto" }}>
        <div className="anim-slideUp" style={{ animationDelay: "0.1s", opacity: 0 }}>
          <div className="font-mono" style={{ fontSize: 12, color: "#00FFD1", letterSpacing: "0.15em", marginBottom: 16 }}>TORONTO'S PREMIUM CUT STUDIO</div>
        </div>
        <h1 className="font-anton anim-slideUp" style={{ fontSize: "clamp(48px, 10vw, 120px)", textTransform: "uppercase", lineHeight: 0.95, color: "#F4F1EA", marginBottom: 24, animationDelay: "0.2s", opacity: 0 }}>
          STREET MEETS<br /><span style={{ color: "#00FFD1" }}>SOPHISTICATED</span>
        </h1>
        <p className="anim-slideUp" style={{ fontSize: 17, color: "#9A978F", maxWidth: 520, lineHeight: 1.7, marginBottom: 36, animationDelay: "0.35s", opacity: 0 }}>
          Where gritty craftsmanship meets premium discipline. Every cut is a statement. Every visit, an experience.
        </p>
        <div className="anim-slideUp" style={{ display: "flex", gap: 14, flexWrap: "wrap", animationDelay: "0.5s", opacity: 0 }}>
          <button onClick={() => { setCurrentPage("book"); window.scrollTo(0, 0); }}
            style={{ background: "#00FFD1", color: "#0B0B0C", border: "none", padding: "16px 36px", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "'Inter', sans-serif", display: "flex", alignItems: "center", gap: 8 }}>
            Book Your Cut <ArrowRight size={16} />
          </button>
          <button onClick={() => setPickerOpen(true)}
            style={{ background: "transparent", color: "#00FFD1", border: "1px solid #00FFD1", padding: "16px 36px", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "'Inter', sans-serif", display: "flex", alignItems: "center", gap: 8 }}>
            <Sparkles size={16} /> Find Your Look
          </button>
        </div>

        {/* Hero Scrub */}
        <div style={{ marginTop: 60 }} className="anim-slideUp" style2={{ animationDelay: "0.6s" }}>
          <HeroScrub />
        </div>
      </section>

      {/* Marquee */}
      <div style={{ overflow: "hidden", borderTop: "1px solid #1A1A1D", borderBottom: "1px solid #1A1A1D", padding: "14px 0" }}>
        <div className="marquee-track">
          {Array(4).fill(null).map((_, i) => (
            <span key={i} className="font-anton" style={{ fontSize: 14, color: "#333", textTransform: "uppercase", letterSpacing: "0.2em", whiteSpace: "nowrap", marginRight: 60 }}>
              FADES ✦ LINEUPS ✦ PERMS ✦ DESIGNS ✦ BEARDS ✦ ROYAL TREATMENT ✦ KIDS CUTS ✦ BUZZ CUTS ✦&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* Top Services */}
      <Section>
        <SectionLabel>What We Do Best</SectionLabel>
        <SectionTitle>Signature Services</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16, marginTop: 32 }}>
          {SERVICES.filter(s => ["skin-fade", "royal", "perm"].includes(s.id)).map(s => (
            <div key={s.id} style={{ background: "#111113", border: "1px solid #1A1A1D", borderRadius: 14, padding: 28, transition: "border-color 0.3s", cursor: "pointer" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "#00FFD1"} onMouseLeave={e => e.currentTarget.style.borderColor = "#1A1A1D"}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <h3 className="font-anton" style={{ fontSize: 22, textTransform: "uppercase", color: "#F4F1EA" }}>{s.name}</h3>
                <span className="font-mono" style={{ fontSize: 20, color: "#00FFD1" }}>${s.price}</span>
              </div>
              <p style={{ fontSize: 14, color: "#9A978F", lineHeight: 1.6, marginBottom: 16 }}>{s.description}</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {s.bestFor.map(tag => (
                  <span key={tag} className="font-mono" style={{ fontSize: 10, color: "#666", border: "1px solid #333", padding: "4px 10px", borderRadius: 4, textTransform: "uppercase" }}>{tag}</span>
                ))}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 14 }}>
                <Clock size={13} color="#666" />
                <span style={{ fontSize: 12, color: "#666" }}>{s.duration} min</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 32 }}>
          <button onClick={() => { setCurrentPage("services"); window.scrollTo(0, 0); }}
            style={{ background: "none", border: "1px solid #333", color: "#F4F1EA", padding: "14px 32px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Inter', sans-serif" }}>
            View Full Menu →
          </button>
        </div>
      </Section>

      {/* The Crew */}
      <Section style={{ paddingTop: 0 }}>
        <SectionLabel>The Crew</SectionLabel>
        <SectionTitle>Meet Your Barbers</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, marginTop: 32 }}>
          {BARBERS.map(b => (
            <div key={b.id} style={{ background: "#111113", border: "1px solid #1A1A1D", borderRadius: 14, overflow: "hidden", transition: "transform 0.3s" }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"} onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
              <div style={{ position: "relative" }}>
                <img src={b.img} alt={b.name} style={{ width: "100%", height: 260, objectFit: "cover", filter: "grayscale(30%)" }} />
                <div style={{ position: "absolute", top: 12, right: 12, display: "flex", alignItems: "center", gap: 6, background: b.available ? "rgba(0,255,209,0.15)" : "rgba(255,77,77,0.15)", padding: "5px 12px", borderRadius: 20, border: `1px solid ${b.available ? "rgba(0,255,209,0.3)" : "rgba(255,77,77,0.3)"}` }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: b.available ? "#00FFD1" : "#FF4D4D" }} />
                  <span style={{ fontSize: 11, color: b.available ? "#00FFD1" : "#FF4D4D", fontWeight: 600 }}>{b.available ? "Available" : "Booked"}</span>
                </div>
              </div>
              <div style={{ padding: 20 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#F4F1EA", marginBottom: 2 }}>{b.name}</h3>
                <p style={{ fontSize: 13, color: "#00FFD1", marginBottom: 10 }}>{b.role}</p>
                <div style={{ display: "flex", gap: 16, fontSize: 12, color: "#9A978F" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Star size={12} color="#FFB800" fill="#FFB800" /> {b.rating}</span>
                  <span>{b.cuts} cuts</span>
                  <span>{b.specialty}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Reviews */}
      <Section style={{ paddingTop: 0 }}>
        <SectionLabel>Word On The Street</SectionLabel>
        <SectionTitle>Client Reviews</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, marginTop: 32 }}>
          {REVIEWS.slice(0, 3).map((r, i) => (
            <div key={i} style={{ background: "#111113", border: "1px solid #1A1A1D", borderRadius: 14, padding: 24 }}>
              <div style={{ display: "flex", gap: 3, marginBottom: 12 }}>
                {Array(r.rating).fill(0).map((_, j) => <Star key={j} size={14} color="#FFB800" fill="#FFB800" />)}
              </div>
              <p style={{ fontSize: 14, color: "#F4F1EA", lineHeight: 1.65, marginBottom: 16 }}>"{r.text}"</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#F4F1EA" }}>{r.name}</span>
                <span style={{ fontSize: 11, color: "#666" }}>{r.date}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Location */}
      <Section style={{ paddingTop: 0 }}>
        <SectionLabel>Find Us</SectionLabel>
        <SectionTitle>Visit The Studio</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 32, marginTop: 32 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <MapPin size={18} color="#00FFD1" />
              <span style={{ fontSize: 15, color: "#F4F1EA" }}>742 Queen St West, Toronto, ON M6J 1E9</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <Clock size={18} color="#00FFD1" />
              <div style={{ fontSize: 14, color: "#9A978F", lineHeight: 1.8 }}>
                Mon – Fri: 9:00 AM – 8:00 PM<br />
                Sat – Sun: 9:00 AM – 6:00 PM
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <Phone size={18} color="#00FFD1" />
              <span style={{ fontSize: 15, color: "#F4F1EA" }}>(416) 555-0142</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Instagram size={18} color="#00FFD1" />
              <span style={{ fontSize: 15, color: "#F4F1EA" }}>@cutcreator2</span>
            </div>
          </div>
          <div style={{ borderRadius: 14, overflow: "hidden", height: 280, background: "#1A1A1D", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2887.1!2d-79.41!3d43.648!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDPCsDM4JzUzLjAiTiA3OcKwMjQnMzYuMCJX!5e0!3m2!1sen!2sca!4v1"
              width="100%" height="100%" style={{ border: 0, filter: "grayscale(100%) invert(92%) contrast(83%)" }} allowFullScreen loading="lazy" title="map"
            />
          </div>
        </div>
      </Section>

      <LookPicker isOpen={pickerOpen} onClose={() => setPickerOpen(false)} onComplete={(choices) => {
        setPickerOpen(false);
        setBookingPrefs(choices);
        setCurrentPage("book");
        window.scrollTo(0, 0);
      }} />
    </>
  );
}

// ─── SERVICES PAGE ───
function ServicesPage({ setCurrentPage }) {
  const [filter, setFilter] = useState("All");
  const categories = ["All", "Men's", "Kids", "Perm", "Add-On"];
  const filtered = filter === "All" ? SERVICES : SERVICES.filter(s => s.category === filter);

  return (
    <Section style={{ paddingTop: 120 }}>
      <SectionLabel>Full Menu</SectionLabel>
      <SectionTitle>Our Services</SectionTitle>
      <p style={{ fontSize: 15, color: "#9A978F", maxWidth: 600, lineHeight: 1.7, marginBottom: 32 }}>
        Every service includes a consultation, hot towel, and styling. Because you deserve more than just a cut.
      </p>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 40 }}>
        {categories.map(c => (
          <button key={c} onClick={() => setFilter(c)}
            style={{ padding: "8px 20px", borderRadius: 8, fontSize: 13, fontWeight: 600, border: "1px solid", cursor: "pointer", fontFamily: "'Inter', sans-serif",
              background: filter === c ? "#00FFD1" : "transparent", color: filter === c ? "#0B0B0C" : "#9A978F", borderColor: filter === c ? "#00FFD1" : "#333" }}>
            {c}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.map(s => (
          <div key={s.id} style={{ background: "#111113", border: "1px solid #1A1A1D", borderRadius: 14, padding: "24px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16, transition: "border-color 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "#00FFD1"} onMouseLeave={e => e.currentTarget.style.borderColor = "#1A1A1D"}>
            <div style={{ flex: 1, minWidth: 240 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#F4F1EA" }}>{s.name}</h3>
                <span className="font-mono" style={{ fontSize: 10, color: "#00FFD1", border: "1px solid rgba(0,255,209,0.3)", padding: "2px 8px", borderRadius: 4, textTransform: "uppercase" }}>{s.category}</span>
              </div>
              <p style={{ fontSize: 13, color: "#9A978F", lineHeight: 1.6, marginBottom: 10 }}>{s.description}</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {s.bestFor.map(tag => (
                  <span key={tag} style={{ fontSize: 10, color: "#666", border: "1px solid #2A2A2D", padding: "3px 8px", borderRadius: 4 }}>{tag}</span>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <div style={{ textAlign: "right" }}>
                <div className="font-mono" style={{ fontSize: 24, color: "#00FFD1", fontWeight: 700 }}>${s.price}</div>
                <div style={{ fontSize: 12, color: "#666", display: "flex", alignItems: "center", gap: 4 }}><Clock size={11} /> {s.duration} min</div>
              </div>
              <button onClick={() => { setCurrentPage("book"); window.scrollTo(0, 0); }}
                style={{ background: "rgba(0,255,209,0.1)", border: "1px solid #00FFD1", color: "#00FFD1", padding: "10px 20px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'Inter', sans-serif", whiteSpace: "nowrap" }}>
                Book →
              </button>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ─── GALLERY PAGE ───
function GalleryPage({ setCurrentPage }) {
  const [filter, setFilter] = useState("All");
  const tags = ["All", "Fade", "Lineup", "Perm", "Design", "Classic", "Bold", "Clean", "Beard", "Kids"];
  const filtered = filter === "All" ? GALLERY_IMAGES : GALLERY_IMAGES.filter(img => img.tags.includes(filter));

  return (
    <Section style={{ paddingTop: 120 }}>
      <SectionLabel>Our Work</SectionLabel>
      <SectionTitle>The Gallery</SectionTitle>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 40, marginTop: 24 }}>
        {tags.map(t => (
          <button key={t} onClick={() => setFilter(t)}
            style={{ padding: "6px 16px", borderRadius: 20, fontSize: 12, fontWeight: 600, border: "1px solid", cursor: "pointer", fontFamily: "'Inter', sans-serif",
              background: filter === t ? "#00FFD1" : "transparent", color: filter === t ? "#0B0B0C" : "#9A978F", borderColor: filter === t ? "#00FFD1" : "#333" }}>
            {t}
          </button>
        ))}
      </div>

      <div className="masonry">
        {filtered.map(img => (
          <div key={img.id} style={{ position: "relative", borderRadius: 12, overflow: "hidden", cursor: "pointer" }}
            onMouseEnter={e => e.currentTarget.querySelector('.gallery-overlay').style.opacity = 1}
            onMouseLeave={e => e.currentTarget.querySelector('.gallery-overlay').style.opacity = 0}>
            <img src={img.url} alt={img.title} style={{ width: "100%", display: "block", borderRadius: 12 }} loading="lazy" />
            <div className="gallery-overlay" style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 16, opacity: 0, transition: "opacity 0.3s" }}>
              <h4 style={{ fontSize: 16, fontWeight: 700, color: "#F4F1EA", marginBottom: 8 }}>{img.title}</h4>
              <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
                {img.tags.map(t => (
                  <span key={t} className="font-mono" style={{ fontSize: 10, color: "#00FFD1", background: "rgba(0,255,209,0.1)", padding: "2px 8px", borderRadius: 4 }}>{t}</span>
                ))}
              </div>
              <button onClick={() => { setCurrentPage("book"); window.scrollTo(0, 0); }}
                style={{ background: "#00FFD1", color: "#0B0B0C", border: "none", padding: "10px 20px", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'Inter', sans-serif", width: "fit-content" }}>
                Book This Style
              </button>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ─── ABOUT PAGE ───
function AboutPage() {
  return (
    <div style={{ paddingTop: 80 }}>
      {/* Brand Story */}
      <Section>
        <SectionLabel>Our Story</SectionLabel>
        <SectionTitle>Born On The Block.<br /><span style={{ color: "#00FFD1" }}>Built For The Culture.</span></SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 40, marginTop: 32 }}>
          <div style={{ fontSize: 15, color: "#9A978F", lineHeight: 1.8 }}>
            <p style={{ marginBottom: 20 }}>
              Cut Creator 2 started in a basement in Kensington Market. One chair, one mirror, one vision: bring the precision of high-end studios to the streets that raised us.
            </p>
            <p style={{ marginBottom: 20 }}>
              Founded in 2019 by Jay Montoya, a second-generation barber who trained under some of Toronto's most respected names before deciding to build something of his own. Something that didn't make you choose between culture and quality.
            </p>
            <p>
              Today, we're a team of three on Queen West — each barber handpicked not just for skill, but for the way they connect with clients. We don't do conveyor-belt cuts. Every seat is a conversation. Every cut, a collaboration.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { icon: <Scissors size={20} />, num: "25K+", label: "Cuts & Counting" },
              { icon: <Users size={20} />, num: "4.8★", label: "Average Rating" },
              { icon: <Award size={20} />, num: "5 yrs", label: "In Business" },
              { icon: <Zap size={20} />, num: "100%", label: "Walk-in Friendly" },
            ].map((stat, i) => (
              <div key={i} style={{ background: "#111113", border: "1px solid #1A1A1D", borderRadius: 12, padding: "20px 24px", display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ color: "#00FFD1" }}>{stat.icon}</div>
                <div>
                  <div className="font-anton" style={{ fontSize: 24, color: "#F4F1EA" }}>{stat.num}</div>
                  <div style={{ fontSize: 12, color: "#9A978F" }}>{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section style={{ paddingTop: 0 }}>
        <SectionLabel>Common Questions</SectionLabel>
        <SectionTitle>FAQ</SectionTitle>
        <div style={{ maxWidth: 700, marginTop: 24 }}>
          <FAQAccordion />
        </div>
      </Section>

      {/* Map */}
      <Section style={{ paddingTop: 0 }}>
        <SectionLabel>Our Location</SectionLabel>
        <SectionTitle>Come Through</SectionTitle>
        <div style={{ borderRadius: 16, overflow: "hidden", height: 400, marginTop: 24 }}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2887.1!2d-79.41!3d43.648!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDPCsDM4JzUzLjAiTiA3OcKwMjQnMzYuMCJX!5e0!3m2!1sen!2sca!4v1"
            width="100%" height="100%" style={{ border: 0, filter: "grayscale(100%) invert(92%) contrast(83%)" }} allowFullScreen loading="lazy" title="map"
          />
        </div>
      </Section>
    </div>
  );
}

// ─── BOOKING PAGE ───
function BookingPage({ prefs }) {
  const [form, setForm] = useState({
    name: "", phone: "", email: "",
    service: prefs?.base === "Perm" ? "perm" : prefs?.base === "Kids" ? "kids-cut" : "",
    barber: "", date: "", time: "",
    notes: prefs ? `Vibe: ${prefs.vibe || "—"} | Length: ${prefs.length || "—"} | Add-ons: ${prefs.addons?.join(", ") || "None"}` : "",
  });
  const [isWeekend, setIsWeekend] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (field === "date") {
      const d = new Date(value);
      setIsWeekend(d.getDay() === 0 || d.getDay() === 6);
    }
  };

  const selectedService = SERVICES.find(s => s.id === form.service);
  const canSubmit = form.name && form.phone && form.service && form.barber && form.date && form.time;

  const handleSubmit = () => {
    if (canSubmit) setSubmitted(true);
  };

  if (submitted) {
    const serviceName = selectedService?.name || form.service;
    const barberName = BARBERS.find(b => b.id === form.barber)?.name || form.barber;
    const icsContent = generateICS(form.date, form.time, serviceName, barberName);
    const googleLink = generateGoogleCalLink(form.date, form.time, serviceName, barberName);
    const icsBlob = new Blob([icsContent], { type: "text/calendar" });
    const icsUrl = URL.createObjectURL(icsBlob);

    return (
      <Section style={{ paddingTop: 120 }}>
        <div style={{ maxWidth: 520, margin: "0 auto", textAlign: "center" }} className="anim-slideUp">
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(0,255,209,0.1)", border: "2px solid #00FFD1", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
            <Check size={32} color="#00FFD1" />
          </div>
          <h2 className="font-anton" style={{ fontSize: 36, textTransform: "uppercase", color: "#F4F1EA", marginBottom: 8 }}>You're Locked In</h2>
          <p style={{ fontSize: 15, color: "#9A978F", marginBottom: 32, lineHeight: 1.6 }}>
            {serviceName} with {barberName}<br />
            {form.date} at {form.time}
          </p>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a href={googleLink} target="_blank" rel="noopener noreferrer"
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 24px", borderRadius: 10, background: "#00FFD1", color: "#0B0B0C", textDecoration: "none", fontWeight: 700, fontSize: 14, fontFamily: "'Inter', sans-serif" }}>
              <Calendar size={16} /> Add to Google Calendar
            </a>
            <a href={icsUrl} download={`cutcreator2-${form.date}.ics`}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 24px", borderRadius: 10, background: "transparent", border: "1px solid #333", color: "#F4F1EA", textDecoration: "none", fontWeight: 600, fontSize: 14, fontFamily: "'Inter', sans-serif" }}>
              <Download size={16} /> Download .ICS
            </a>
          </div>

          <p style={{ marginTop: 32, fontSize: 13, color: "#666" }}>
            A confirmation will be sent to <span style={{ color: "#00FFD1" }}>{form.email || "your email"}</span>
          </p>
        </div>
      </Section>
    );
  }

  return (
    <Section style={{ paddingTop: 120 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 40 }}>
        {/* Form */}
        <div>
          <SectionLabel>Reserve Your Spot</SectionLabel>
          <SectionTitle>Book A Cut</SectionTitle>

          {prefs && prefs.base && (
            <div style={{ background: "rgba(0,255,209,0.06)", border: "1px solid rgba(0,255,209,0.2)", borderRadius: 10, padding: "12px 16px", marginBottom: 24, display: "flex", alignItems: "center", gap: 10 }}>
              <Sparkles size={16} color="#00FFD1" />
              <span style={{ fontSize: 13, color: "#00FFD1" }}>Look Picker preferences applied!</span>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 24 }}>
            <div>
              <label style={{ fontSize: 12, color: "#9A978F", marginBottom: 6, display: "block" }}>Full Name *</label>
              <input value={form.name} onChange={e => updateField("name", e.target.value)} placeholder="Your name" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, color: "#9A978F", marginBottom: 6, display: "block" }}>Phone *</label>
                <input value={form.phone} onChange={e => updateField("phone", e.target.value)} placeholder="(416) 555-0000" />
              </div>
              <div>
                <label style={{ fontSize: 12, color: "#9A978F", marginBottom: 6, display: "block" }}>Email</label>
                <input value={form.email} onChange={e => updateField("email", e.target.value)} placeholder="you@email.com" type="email" />
              </div>
            </div>
            <div>
              <label style={{ fontSize: 12, color: "#9A978F", marginBottom: 6, display: "block" }}>Service *</label>
              <select value={form.service} onChange={e => updateField("service", e.target.value)}>
                <option value="">Select a service...</option>
                {SERVICES.map(s => <option key={s.id} value={s.id}>{s.name} — ${s.price} ({s.duration} min)</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, color: "#9A978F", marginBottom: 6, display: "block" }}>Barber *</label>
              <select value={form.barber} onChange={e => updateField("barber", e.target.value)}>
                <option value="">Select a barber...</option>
                {BARBERS.map(b => <option key={b.id} value={b.id}>{b.name} — {b.specialty} {b.available ? "✓" : "(Booked)"}</option>)}
              </select>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, color: "#9A978F", marginBottom: 6, display: "block" }}>Date *</label>
                <input type="date" value={form.date} onChange={e => updateField("date", e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: 12, color: "#9A978F", marginBottom: 6, display: "block" }}>Time *</label>
                <select value={form.time} onChange={e => updateField("time", e.target.value)}>
                  <option value="">Select time...</option>
                  {["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30"].map(t => (
                    <option key={t} value={t}>{t.replace(/^(\d{2}):(\d{2})$/, (_, h, m) => {
                      const hr = parseInt(h);
                      return `${hr > 12 ? hr - 12 : hr}:${m} ${hr >= 12 ? "PM" : "AM"}`;
                    })}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label style={{ fontSize: 12, color: "#9A978F", marginBottom: 6, display: "block" }}>Notes</label>
              <textarea value={form.notes} onChange={e => updateField("notes", e.target.value)} placeholder="Special requests, style references..." rows={3}
                style={{ resize: "vertical", minHeight: 80, fontFamily: "'Inter', sans-serif" }} />
            </div>

            <button onClick={handleSubmit} disabled={!canSubmit}
              style={{ marginTop: 8, padding: "16px", borderRadius: 10, border: "none", fontSize: 15, fontWeight: 700, cursor: canSubmit ? "pointer" : "not-allowed", fontFamily: "'Inter', sans-serif", textTransform: "uppercase",
                background: canSubmit ? "#00FFD1" : "#333", color: canSubmit ? "#0B0B0C" : "#666" }}>
              Confirm Booking
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <BusyIndicator isWeekend={isWeekend} setIsWeekend={setIsWeekend} />

          {selectedService && (
            <div style={{ background: "#111113", border: "1px solid #1A1A1D", borderRadius: 16, padding: 24 }}>
              <p className="font-mono" style={{ fontSize: 11, color: "#00FFD1", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Selected Service</p>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: "#F4F1EA", marginBottom: 6 }}>{selectedService.name}</h3>
              <p style={{ fontSize: 13, color: "#9A978F", lineHeight: 1.6, marginBottom: 12 }}>{selectedService.description}</p>
              <div style={{ display: "flex", gap: 16 }}>
                <span className="font-mono" style={{ fontSize: 18, color: "#00FFD1" }}>${selectedService.price}</span>
                <span style={{ fontSize: 14, color: "#666", display: "flex", alignItems: "center", gap: 4 }}><Clock size={13} /> {selectedService.duration} min</span>
              </div>
            </div>
          )}

          <div style={{ background: "#111113", border: "1px solid #1A1A1D", borderRadius: 16, padding: 24 }}>
            <p className="font-mono" style={{ fontSize: 11, color: "#00FFD1", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Studio Info</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 14, color: "#9A978F" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <MapPin size={15} color="#666" /> 742 Queen St W, Toronto
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Phone size={15} color="#666" /> (416) 555-0142
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Mail size={15} color="#666" /> booking.cutcreator2@gmail.com
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

// ─── FOOTER ───
function Footer({ setCurrentPage }) {
  return (
    <footer style={{ borderTop: "1px solid #1A1A1D", padding: "48px 24px 32px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 32, marginBottom: 40 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <Scissors size={20} color="#00FFD1" />
              <span className="font-anton" style={{ fontSize: 18, color: "#F4F1EA", textTransform: "uppercase" }}>Cut Creator <span style={{ color: "#00FFD1" }}>2</span></span>
            </div>
            <p style={{ fontSize: 13, color: "#666", maxWidth: 280, lineHeight: 1.6 }}>
              Toronto's premium cut studio. Where street culture meets surgical precision.
            </p>
          </div>
          <div style={{ display: "flex", gap: 40, flexWrap: "wrap" }}>
            <div>
              <h4 style={{ fontSize: 12, fontWeight: 700, color: "#F4F1EA", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Navigate</h4>
              {["home", "services", "gallery", "about"].map(p => (
                <button key={p} onClick={() => { setCurrentPage(p); window.scrollTo(0, 0); }}
                  style={{ display: "block", background: "none", border: "none", color: "#666", fontSize: 13, cursor: "pointer", padding: "4px 0", textTransform: "capitalize", fontFamily: "'Inter', sans-serif" }}>
                  {p}
                </button>
              ))}
            </div>
            <div>
              <h4 style={{ fontSize: 12, fontWeight: 700, color: "#F4F1EA", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Contact</h4>
              <p style={{ fontSize: 13, color: "#666", lineHeight: 2 }}>
                742 Queen St W<br />Toronto, ON M6J 1E9<br />(416) 555-0142
              </p>
            </div>
          </div>
        </div>
        <div style={{ borderTop: "1px solid #1A1A1D", paddingTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <span className="font-mono" style={{ fontSize: 11, color: "#444" }}>© 2025 CUT CREATOR 2. ALL RIGHTS RESERVED.</span>
          <span className="font-mono" style={{ fontSize: 11, color: "#444" }}>TORONTO, CANADA 🇨🇦</span>
        </div>
      </div>
    </footer>
  );
}

// ─── APP ───
export default function CutCreator2() {
  const [currentPage, setCurrentPage] = useState("home");
  const [bookingPrefs, setBookingPrefs] = useState(null);

  const renderPage = () => {
    switch (currentPage) {
      case "home": return <HomePage setCurrentPage={setCurrentPage} setBookingPrefs={setBookingPrefs} />;
      case "services": return <ServicesPage setCurrentPage={setCurrentPage} />;
      case "gallery": return <GalleryPage setCurrentPage={setCurrentPage} />;
      case "about": return <AboutPage />;
      case "book": return <BookingPage prefs={bookingPrefs} />;
      default: return <HomePage setCurrentPage={setCurrentPage} setBookingPrefs={setBookingPrefs} />;
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0B0B0C" }}>
      <GrainOverlay />
      <Nav currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main>{renderPage()}</main>
      <Footer setCurrentPage={setCurrentPage} />
    </div>
  );
}
