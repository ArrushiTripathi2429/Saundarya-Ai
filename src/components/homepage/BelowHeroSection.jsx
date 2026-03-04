"use client";

import { motion } from "motion/react";
import { HeroHighlight, Highlight } from "../ui/hero-highlight";

export default function BelowHeroSection() {
  return (
    <>
      <style>{`
    

        @keyframes shimmer {
          0%   { background-position: -300% center; }
          100% { background-position:  300% center; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes softPulse {
          0%, 100% { opacity: 0.5; }
          50%       { opacity: 1; }
        }

        .features-label {
          animation: fadeUp 0.7s 0.1s ease both;
        }
        .features-heading {
          animation: fadeUp 0.8s 0.2s ease both;
        }

        .gold-shimmer-features {
          background: linear-gradient(
            90deg,
            #c9a96e 0%, #f5e4a0 25%, #e8c87a 45%,
            #c9a96e 55%, #f0d898 75%, #c9a96e 100%
          );
          background-size: 300% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 5s linear infinite;
        }

        .divider-pulse {
          animation: softPulse 3s ease-in-out infinite;
        }
      `}</style>

      <div className="w-full">

        {/* ── HERO HIGHLIGHT SECTION ── */}
        <div className="min-h-screen flex items-center justify-center">
          <HeroHighlight>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: [20, -5, 0] }}
              transition={{ duration: 0.6, ease: [0.4, 0.0, 0.2, 1] }}
              style={{ textAlign: "center", maxWidth: "860px", padding: "0 24px" }}
            >
              {/* Small label */}
              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "11px",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "#c9a96e",
                fontWeight: 600,
                marginBottom: "20px",
                opacity: 0.85,
              }}>
                The science behind it
              </p>

              {/* Main quote */}
              <h1
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(26px, 4.5vw, 54px)",
                  fontWeight: 700,
                  lineHeight: 1.25,
                  letterSpacing: "-0.01em",
                  color: "rgba(255,255,255,0.88)",
                  margin: 0,
                }}
              >
                AI-powered skin analysis that understands your skin type,
                detects concerns, and builds a personalized routine —{" "}
                <Highlight className="text-black dark:text-white">
                  because your skin is unique, not generic.
                </Highlight>
              </h1>

              {/* Divider */}
              <div className="divider-pulse" style={{
                width: "52px", height: "1.5px",
                background: "linear-gradient(90deg, transparent, #c9a96e, transparent)",
                margin: "28px auto 0",
                borderRadius: "999px",
              }} />
            </motion.div>
          </HeroHighlight>
        </div>

        {/* ── FEATURES HEADING SECTION ── */}
        <section className="w-full bg-black py-32">
          <div style={{ textAlign: "center" }}>

            {/* Label */}
            <p className="features-label" style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "11px",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#c9a96e",
              fontWeight: 600,
              marginBottom: "16px",
            }}>
              What we offer
            </p>

            {/* Big heading */}
            <h2
              className="features-heading"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(52px, 10vw, 110px)",
                fontWeight: 700,
                lineHeight: 1,
                letterSpacing: "-0.02em",
                margin: 0,
              }}
            >
              <span className="gold-shimmer-features">Features</span>
            </h2>

            {/* Thin gold underline */}
            <div className="features-label" style={{
              width: "64px", height: "2px",
              background: "linear-gradient(90deg, transparent, #c9a96e, transparent)",
              margin: "20px auto 0",
              borderRadius: "999px",
            }} />

          </div>
        </section>

      </div>
    </>
  );
}
