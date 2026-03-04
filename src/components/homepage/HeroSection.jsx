"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const BackgroundBeamsWithCollision = dynamic(
  () =>
    import("@/components/ui/background-beams-with-collision").then(
      (mod) => mod.BackgroundBeamsWithCollision
    ),
  { ssr: false }
);

export default function HeroSection() {
  const { data: session, status } = useSession();
  const router = useRouter();

  return (
    <>
      <style>{`
    

        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position: -300% center; }
          100% { background-position:  300% center; }
        }
        @keyframes softPulse {
          0%, 100% { opacity: 0.6; transform: scale(1);   }
          50%       { opacity: 1;   transform: scale(1.04); }
        }
        @keyframes btnGlow {
          0%, 100% { box-shadow: 0 0 18px #c9a96e44; }
          50%       { box-shadow: 0 0 36px #c9a96e88; }
        }

        .hero-tag    { animation: fadeDown 0.7s 0.1s ease both; }
        .hero-h1     { animation: fadeDown 0.8s 0.2s ease both; }
        .hero-brand  { animation: fadeUp  0.8s 0.35s ease both; }
        .hero-sub    { animation: fadeUp  0.7s 0.5s  ease both; }
        .hero-btn    { animation: fadeUp  0.7s 0.65s ease both; }

        .gold-shimmer {
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

        .brand-text {
          background: linear-gradient(
            135deg,
            #ffffff  0%,
            #f5e4a0 30%,
            #c9a96e 55%,
            #e8c87a 75%,
            #ffffff 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 6s linear infinite;
        }

        .hero-cta-btn {
          position: relative;
          overflow: hidden;
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          font-size: 15px;
          letter-spacing: 0.06em;
          padding: 13px 40px;
          border-radius: 14px;
          border: 1px solid #c9a96e88;
          background: linear-gradient(135deg, rgba(201,169,110,0.15), rgba(240,192,64,0.08));
          color: #f5e4a0;
          cursor: pointer;
          transition: all 0.3s ease;
          animation: btnGlow 3s ease-in-out infinite;
          backdrop-filter: blur(6px);
        }
        .hero-cta-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(201,169,110,0.25), transparent);
          opacity: 0;
          transition: opacity 0.3s ease;
          border-radius: inherit;
        }
        .hero-cta-btn:hover::before { opacity: 1; }
        .hero-cta-btn:hover {
          border-color: #c9a96e;
          color: #fff;
          transform: translateY(-2px);
          box-shadow: 0 8px 32px #c9a96e44;
        }

        .hero-login-btn {
          font-family: 'DM Sans', sans-serif;
          font-weight: 400;
          font-size: 14px;
          letter-spacing: 0.05em;
          padding: 12px 36px;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.7);
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(6px);
        }
        .hero-login-btn:hover {
          border-color: rgba(201,169,110,0.5);
          color: #f5e4a0;
          background: rgba(201,169,110,0.08);
          transform: translateY(-2px);
        }

        .divider-line {
          width: 60px; height: 1px;
          background: linear-gradient(90deg, transparent, #c9a96e88, transparent);
          margin: 0 auto;
          animation: softPulse 3s ease-in-out infinite;
        }
      `}</style>

      <BackgroundBeamsWithCollision>
        <div
          className="relative z-20 flex min-h-screen flex-col items-center justify-center px-4 text-center"
          style={{ gap: 0 }}
        >

          {/* Top label pill */}
          <div className="hero-tag" style={{ marginBottom: "28px" }}>
            <span style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "11px",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#c9a96e",
              fontWeight: 600,
              background: "rgba(201,169,110,0.1)",
              border: "1px solid rgba(201,169,110,0.25)",
              padding: "5px 16px",
              borderRadius: "999px",
            }}>
              AI-Powered Skin Intelligence
            </span>
          </div>

          {/* Main heading */}
          <h1
            className="hero-h1"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(28px, 5vw, 58px)",
              fontWeight: 700,
              color: "rgba(255,255,255,0.88)",
              lineHeight: 1.12,
              letterSpacing: "-0.01em",
              maxWidth: "780px",
              marginBottom: "20px",
            }}
          >
            Why settle for{" "}
            <em style={{ fontStyle: "italic", color: "rgba(255,255,255,0.45)" }}>generic</em>{" "}
            skincare
            <br />
            when your skin is{" "}
            <span className="gold-shimmer">one of a kind?</span>
          </h1>

          {/* Divider */}
          <div className="divider-line" style={{ marginBottom: "20px" }} />

          {/* Brand name */}
          <div className="hero-brand" style={{ marginBottom: "24px" }}>
            <span
              className="brand-text"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(52px, 10vw, 110px)",
                fontWeight: 700,
                lineHeight: 1,
                letterSpacing: "-0.02em",
              }}
            >
              Saundarya Ai
            </span>
          </div>

        
          <p
            className="hero-sub"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "clamp(13px, 1.8vw, 16px)",
              fontWeight: 300,
              color: "rgba(255,255,255,0.38)",
              letterSpacing: "0.04em",
              maxWidth: "420px",
              lineHeight: 1.7,
              marginBottom: "40px",
            }}
          >
            Scan your face. Understand your skin. Get a routine that's actually built for you.
          </p>

    
          <div className="hero-btn">
            {status !== "loading" && (
              session ? (
                <Link href="/face-scan">
                  <button className="hero-cta-btn">
                    ✦ &nbsp;Analyse my skin
                  </button>
                </Link>
              ) : (
                <button
                  className="hero-login-btn"
                  onClick={() => router.push("/auth/login")}
                >
                  Get started →
                </button>
              )
            )}
          </div>

        </div>
      </BackgroundBeamsWithCollision>
    </>
  );
}
