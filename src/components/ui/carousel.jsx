"use client";
import { IconArrowNarrowRight } from "@tabler/icons-react";
import { useState, useRef, useId, useEffect } from "react";

// ─── Smart feedback ───────────────────────────────────────────────────────────
const getFeedback = (metric, score) => {
  const s = Number(score);
  const map = {
    Oil: [
      [20,  "✨ Your skin is beautifully balanced — barely any excess oil at all."],
      [45,  "👌 Mild oiliness, totally normal. Your skin is mostly in control."],
      [70,  "💧 Moderate oil levels. A gentle mattifying routine could help."],
      [100, "🌊 High sebum activity detected. Time to look into oil-control skincare."],
    ],
    Acne: [
      [20,  "🎉 Ohh nice! Your acne score is really low — your skin is mostly clear!"],
      [45,  "😌 A few occasional breakouts, but nothing to stress over."],
      [70,  "⚠️ Moderate acne present. A consistent routine can make a real difference."],
      [100, "🔴 High acne activity. Consider consulting a dermatologist for a plan."],
    ],
    Blackheads: [
      [20,  "🌟 Barely any blackheads — your pores are looking clean and clear!"],
      [45,  "👍 Mild congestion only. Regular cleansing should keep this in check."],
      [70,  "🔍 Noticeable blackheads. Try a BHA exfoliant a couple times a week."],
      [100, "😬 Heavy pore congestion. Deep cleansing and exfoliation are key here."],
    ],
    Pigmentation: [
      [20,  "💫 Very even skin tone — minimal pigmentation, great news!"],
      [45,  "🙂 Slight unevenness, but your complexion is still quite uniform."],
      [70,  "🌗 Some dark spots visible. Vitamin C or niacinamide serums can help."],
      [100, "🔶 Significant pigmentation. SPF daily + a brightening serum is essential."],
    ],
    Hydration: [
      [30,  "🚨 Your skin is quite dehydrated. Drink more water and use a humectant serum."],
      [55,  "😬 Below average hydration. Your barrier could use a boost."],
      [80,  "💧 Good hydration levels — your moisture barrier is doing its job."],
      [100, "🌊 Excellent hydration! Your skin is plump, bouncy, and well-nourished."],
    ],
    Sensitivity: [
      [20,  "🛡️ Very low sensitivity — your skin handles most products without issues."],
      [45,  "😊 Mildly reactive. Patch-test new products and you'll be fine."],
      [70,  "⚡ Moderately sensitive. Stick to fragrance-free, gentle formulas."],
      [100, "🌡️ Highly sensitive. Minimal ingredients, no actives until skin calms down."],
    ],
  };
  const ranges = map[metric];
  if (!ranges) return null;
  for (const [threshold, msg] of ranges) {
    if (s <= threshold) return msg;
  }
  return ranges[ranges.length - 1][1];
};

// ─── Score Ring ───────────────────────────────────────────────────────────────
const ScoreRing = ({ value, color, isText, textValue }) => {
  const [animated, setAnimated] = useState(0);
  const size = 200;
  const sw = 8;
  const nr = size / 2 - sw / 2 - 4;
  const circumference = 2 * Math.PI * nr;
  const dash = (animated / 100) * circumference;

  useEffect(() => {
    if (isText) return;
    const t = setTimeout(() => setAnimated(value), 150);
    return () => clearTimeout(t);
  }, [value, isText]);

  if (isText) {
    return (
      <div style={{
        width: size, height: size, borderRadius: "50%",
        border: `7px solid ${color}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: `0 0 40px ${color}66, inset 0 0 28px ${color}22`,
        background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)",
        flexShrink: 0,
      }}>
        <span style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "26px", fontWeight: 700, color: "white",
          textAlign: "center", lineHeight: 1.2, padding: "0 14px",
        }}>{textValue}</span>
      </div>
    );
  }

  const cx = size / 2;
  const cy = size / 2;

  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      {/* glow bg */}
      <div style={{
        position: "absolute", inset: 0, borderRadius: "50%",
        background: `radial-gradient(circle, ${color}22 0%, transparent 70%)`,
        filter: "blur(10px)",
      }} />
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ position: "relative", zIndex: 1 }}>
        {/* track */}
        <circle cx={cx} cy={cy} r={nr}
          fill="rgba(0,0,0,0.35)"
          stroke="rgba(255,255,255,0.07)" strokeWidth={sw} />
        {/* arc */}
        <circle cx={cx} cy={cy} r={nr}
          fill="none" stroke={color} strokeWidth={sw}
          strokeDasharray={`${dash} ${circumference}`}
          strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cy})`}
          style={{
            transition: "stroke-dasharray 1.5s cubic-bezier(0.4,0,0.2,1)",
            filter: `drop-shadow(0 0 12px ${color}) drop-shadow(0 0 5px ${color})`,
          }} />
        {/* score number */}
        <text x={cx} y={cy - 8} textAnchor="middle" fill="white"
          fontSize="44" fontWeight="700"
          style={{ fontFamily: "'DM Sans', sans-serif" }}>{value}</text>
        {/* out of 100 */}
        <text x={cx} y={cy + 18} textAnchor="middle"
          fill="rgba(255,255,255,0.38)" fontSize="14"
          style={{ fontFamily: "'DM Sans', sans-serif" }}>out of 100</text>
      </svg>
    </div>
  );
};

// ─── Constants ────────────────────────────────────────────────────────────────
const METRIC_COLORS = {
  "Skin Type":    "#c9a96e",
  "Oil":          "#f0c040",
  "Acne":         "#e05c5c",
  "Blackheads":   "#9b7fd4",
  "Pigmentation": "#c47a5a",
  "Hydration":    "#5ab8d4",
  "Sensitivity":  "#e8a0bf",
};

// ─── Slide ────────────────────────────────────────────────────────────────────
const Slide = ({ slide, index, current, handleSlideClick }) => {
  const slideRef = useRef(null);
  const xRef = useRef(0);
  const yRef = useRef(0);
  const frameRef = useRef();

  useEffect(() => {
    const animate = () => {
      if (!slideRef.current) return;
      slideRef.current.style.setProperty("--x", `${xRef.current}px`);
      slideRef.current.style.setProperty("--y", `${yRef.current}px`);
      frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, []);

  const handleMouseMove = (e) => {
    const el = slideRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    xRef.current = e.clientX - (rect.left + Math.floor(rect.width / 2));
    yRef.current = e.clientY - (rect.top + Math.floor(rect.height / 2));
  };
  const handleMouseLeave = () => { xRef.current = 0; yRef.current = 0; };

  const { src, button, title, color, isText, score, textValue } = slide;
  const isActive = current === index;
  const feedback = !isText ? getFeedback(button, score) : null;

  return (
    <div className="[perspective:1200px] [transform-style:preserve-3d]">
      <li
        ref={slideRef}
        className="flex flex-1 flex-col items-center justify-center relative text-center text-white w-[70vmin] h-[70vmin] mx-[4vmin] z-10"
        onClick={() => handleSlideClick(index)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: isActive ? "scale(1) rotateX(0deg)" : "scale(0.98) rotateX(8deg)",
          transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          transformOrigin: "bottom",
        }}
      >
        {/* Card BG */}
        <div
          className="absolute top-0 left-0 w-full h-full rounded-[1%] overflow-hidden transition-all duration-150 ease-out"
          style={{
            background: "#1D1F2F",
            transform: isActive ? "translate3d(calc(var(--x) / 30), calc(var(--y) / 30), 0)" : "none",
            boxShadow: isActive ? `0 0 60px ${color}33, 0 30px 60px rgba(0,0,0,0.5)` : "none",
          }}
        >
          <img
            className="absolute inset-0 w-[120%] h-[120%] object-cover"
            style={{ opacity: isActive ? 0.32 : 0.12, transition: "opacity 0.6s ease" }}
            alt={title} src={src} loading="eager" decoding="sync"
          />
          {/* single clean overlay — no blurred text artifacts */}
          <div className="absolute inset-0" style={{
            background: `linear-gradient(160deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.18) 60%, ${color}14 100%)`,
          }} />
          {isActive && (
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: "3px",
              background: color, boxShadow: `0 0 18px ${color}`,
            }} />
          )}
        </div>

        {/* Content — only visible on active, no ghost on inactive */}
        {isActive && (
          <article
            className="relative flex flex-col items-center gap-4 p-[4vmin]"
            style={{ width: "100%" }}
          >
            {/* Heading */}
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(32px, 6vmin, 54px)",
              fontWeight: 700,
              color: "white",
              lineHeight: 1.05,
              letterSpacing: "-0.01em",
              textShadow: "0 2px 20px rgba(0,0,0,0.6)",
            }}>{title}</h2>

            {/* Ring */}
            <ScoreRing value={score} color={color} isText={isText} textValue={textValue} />

            {/* Feedback */}
            {feedback && (
              <p style={{
                color: "rgba(255,255,255,0.88)",
                fontSize: "clamp(13px, 2vmin, 16px)",
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 400,
                lineHeight: 1.55,
                maxWidth: "82%",
              }}>{feedback}</p>
            )}

            {isText && (
              <p style={{
                color: "rgba(255,255,255,0.45)",
                fontSize: "14px",
                fontFamily: "'DM Sans', sans-serif",
              }}>Your unique skin identity</p>
            )}
          </article>
        )}
      </li>
    </div>
  );
};

// ─── Controls ─────────────────────────────────────────────────────────────────
const CarouselControl = ({ type, title, handleClick }) => (
  <button
    className={`w-10 h-10 flex items-center mx-2 justify-center bg-neutral-200 dark:bg-neutral-800 border-3 border-transparent rounded-full focus:border-[#6D64F7] focus:outline-none hover:-translate-y-0.5 active:translate-y-0.5 transition duration-200 ${type === "previous" ? "rotate-180" : ""}`}
    title={title} onClick={handleClick}
  >
    <IconArrowNarrowRight className="text-neutral-600 dark:text-neutral-200" />
  </button>
);

// ─── Carousel ─────────────────────────────────────────────────────────────────
export function Carousel({ slides }) {
  const [current, setCurrent] = useState(0);
  const id = useId();

  const enriched = slides.map((slide) => {
    const color = METRIC_COLORS[slide.button] || "#c9a96e";
    const isText = slide.button === "Skin Type";
    const match = slide.title.match(/(\d+)\/100/);
    const score = match ? parseInt(match[1]) : 0;
    const textValue = isText ? slide.title.replace("Skin Type: ", "") : null;
    const cleanTitle = isText
      ? "Your Skin Type"
      : slide.title.replace(/^[\w\s]+:\s*\d+\/100$/, slide.button);
    return { ...slide, color, isText, score, textValue, title: cleanTitle };
  });

  const handlePreviousClick = () => setCurrent((c) => (c - 1 < 0 ? enriched.length - 1 : c - 1));
  const handleNextClick = () => setCurrent((c) => (c + 1 === enriched.length ? 0 : c + 1));
  const handleSlideClick = (index) => { if (current !== index) setCurrent(index); };

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');`}</style>

      <div
        className="relative w-[70vmin] h-[70vmin] mx-auto"
        aria-labelledby={`carousel-heading-${id}`}
      >
        <ul
          className="absolute flex mx-[-4vmin] transition-transform duration-1000 ease-in-out"
          style={{ transform: `translateX(-${current * (100 / enriched.length)}%)` }}
        >
          {enriched.map((slide, index) => (
            <Slide key={index} slide={slide} index={index} current={current} handleSlideClick={handleSlideClick} />
          ))}
        </ul>

        {/* Arrows — pushed further down with more breathing room */}
        <div className="absolute flex justify-center w-full" style={{ top: "calc(100% + 2rem)" }}>
          <CarouselControl type="previous" title="Go to previous slide" handleClick={handlePreviousClick} />
          <CarouselControl type="next" title="Go to next slide" handleClick={handleNextClick} />
        </div>

        {/* Dot indicators — below arrows with clear gap */}
        <div style={{
          position: "absolute",
          top: "calc(100% + 4.5rem)",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: "7px",
          alignItems: "center",
        }}>
          {enriched.map((s, i) => (
            <button key={i} onClick={() => setCurrent(i)} style={{
              width: i === current ? "22px" : "7px",
              height: "7px",
              borderRadius: "999px",
              background: i === current ? (enriched[i]?.color || "white") : "rgba(255,255,255,0.22)",
              border: "none", cursor: "pointer", transition: "all 0.3s ease",
              boxShadow: i === current ? `0 0 10px ${enriched[i]?.color}` : "none",
              padding: 0,
            }} />
          ))}
        </div>
      </div>
    </>
  );
}
