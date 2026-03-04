"use client";

import { GlareCard } from "../ui/glare-card";
import { signOut } from "next-auth/react";

const features = [
  {
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <circle cx="18" cy="18" r="17" stroke="#c9a96e" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.4" />
        <circle cx="18" cy="18" r="10" stroke="#c9a96e" strokeWidth="1.5" />
        <circle cx="18" cy="18" r="4" fill="#c9a96e" opacity="0.9" />
        <path d="M18 4v4M18 28v4M4 18h4M28 18h4" stroke="#c9a96e" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      </svg>
    ),
    color: "#c9a96e",
    title: "AI Skin Analysis",
    desc: "Advanced AI scans your skin to identify type, texture, and visible concerns with high accuracy.",
    tag: "Powered by Vision AI",
  },
  {
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <path d="M18 3C18 3 8 9 8 18C8 23.5 12.5 28 18 28C23.5 28 28 23.5 28 18C28 9 18 3 18 3Z" stroke="#5ab8d4" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M13 18C13 15.2 15.2 13 18 13" stroke="#5ab8d4" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="18" cy="18" r="2.5" fill="#5ab8d4" />
        <path d="M18 28v4M14 31l4-3 4 3" stroke="#5ab8d4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
      </svg>
    ),
    color: "#5ab8d4",
    title: "Personalized Routine",
    desc: "Get a customized skincare routine built specifically for your unique skin goals and lifestyle.",
    tag: "Tailored Just For You",
  },
  {
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <rect x="4" y="24" width="6" height="8" rx="1.5" fill="#9b7fd4" opacity="0.5" />
        <rect x="13" y="18" width="6" height="14" rx="1.5" fill="#9b7fd4" opacity="0.7" />
        <rect x="22" y="12" width="6" height="20" rx="1.5" fill="#9b7fd4" />
        <path d="M6 20L13 15L20 11L28 6" stroke="#9b7fd4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="28" cy="6" r="2.5" fill="#9b7fd4" />
      </svg>
    ),
    color: "#9b7fd4",
    title: "Progress Tracking",
    desc: "Track improvements over time with detailed before–after insights and trend analysis.",
    tag: "Visual Over Time",
  },
];

export default function FeatureSection() {
  return (
    <>
      <style>{`
      

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .feature-card-wrap { animation: fadeUp 0.7s ease both; }
        .feature-card-wrap:nth-child(1) { animation-delay: 0.05s; }
        .feature-card-wrap:nth-child(2) { animation-delay: 0.18s; }
        .feature-card-wrap:nth-child(3) { animation-delay: 0.31s; }
      `}</style>

      <section className="w-full bg-black pt-2 pb-32">
        <div className="max-w-6xl mx-auto px-6">

          {/* Section label */}
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "11px",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#c9a96e",
              fontWeight: 600,
              marginBottom: "12px",
            }}>What we offer</p>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(32px, 5vw, 52px)",
              fontWeight: 700,
              color: "white",
              lineHeight: 1.1,
              letterSpacing: "-0.01em",
            }}>
              Everything your skin{" "}
              <span style={{
                background: "linear-gradient(90deg, #c9a96e, #f0d898, #c9a96e)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>needs</span>
            </h2>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {features.map((f, i) => (
              <div key={i} className="feature-card-wrap flex justify-center">
                <GlareCard className="flex flex-col items-center justify-center text-center px-7 py-2 gap-0">

                  {/* Icon circle */}
                  <div style={{
                    width: 68, height: 68,
                    borderRadius: "50%",
                    border: `1.5px solid ${f.color}44`,
                    background: `radial-gradient(circle, ${f.color}14 0%, transparent 70%)`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    marginBottom: "18px",
                    boxShadow: `0 0 20px ${f.color}22`,
                  }}>
                    {f.icon}
                  </div>

                  {/* Tag pill */}
                  <span style={{
                    fontSize: "10px",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: f.color,
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 600,
                    background: `${f.color}14`,
                    padding: "3px 10px",
                    borderRadius: "999px",
                    border: `1px solid ${f.color}33`,
                    marginBottom: "12px",
                    display: "inline-block",
                  }}>{f.tag}</span>

                  {/* Title */}
                  <h3 style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "24px",
                    fontWeight: 700,
                    color: "white",
                    lineHeight: 1.2,
                    marginBottom: "10px",
                  }}>{f.title}</h3>

                  {/* Description */}
                  <p style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "13.5px",
                    fontWeight: 300,
                    color: "rgba(255,255,255,0.5)",
                    lineHeight: 1.65,
                    maxWidth: "220px",
                  }}>{f.desc}</p>

                  {/* Bottom accent line */}
                  <div style={{
                    width: "32px", height: "2px",
                    background: `linear-gradient(90deg, transparent, ${f.color}, transparent)`,
                    borderRadius: "999px",
                    marginTop: "20px",
                  }} />
                </GlareCard>
              </div>
            ))}
          </div>

          {/* Logout */}
          <div className="mt-20 flex justify-center">
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 500,
                fontSize: "14px",
                letterSpacing: "0.04em",
                padding: "10px 32px",
                borderRadius: "12px",
                background: "transparent",
                border: "1px solid rgba(224,92,92,0.4)",
                color: "rgba(224,92,92,0.8)",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "rgba(224,92,92,0.1)";
                e.currentTarget.style.borderColor = "rgba(224,92,92,0.7)";
                e.currentTarget.style.color = "#e05c5c";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.borderColor = "rgba(224,92,92,0.4)";
                e.currentTarget.style.color = "rgba(224,92,92,0.8)";
              }}
            >
              Sign out
            </button>
          </div>

        </div>
      </section>
    </>
  );
}
