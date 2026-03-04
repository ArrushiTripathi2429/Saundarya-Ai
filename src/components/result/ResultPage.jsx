"use client";

import { useEffect, useState } from "react";
import { Carousel } from "@/components/ui/carousel";

export default function ResultPageComponent() {
  const [slideData, setSlideData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("skinAnalysis");

    if (!stored) {
      setLoading(false);
      return;
    }

    const a = JSON.parse(stored);

    setSlideData([
      { title: `Skin Type: ${a.skinType}`, button: "Skin Type", src: "/skin/skin-type.jpg" },
      { title: `Oil Level: ${a.oil}/100`, button: "Oil", src: "/skin/oil.jpg" },
      { title: `Acne Level: ${a.acne}/100`, button: "Acne", src: "/skin/acne.jpg" },
      { title: `Blackheads: ${a.blackheads}/100`, button: "Blackheads", src: "/skin/blackheads.jpg" },
      { title: `Pigmentation: ${a.pigmentation}/100`, button: "Pigmentation", src: "/skin/pigmentation.jpg" },
      { title: `Hydration: ${a.hydration}/100`, button: "Hydration", src: "/skin/hydration.jpg" },
      { title: `Sensitivity: ${a.sensitivity}/100`, button: "Sensitivity", src: "/skin/sensitive.jpg" },
    ]);

    setLoading(false);
  }, []);

  if (loading) {
    return <p className="text-white text-center py-20">Loading your results…</p>;
  }

  if (!slideData.length) {
    return <p className="text-white text-center py-20">No analysis found. Please analyze your skin again.</p>;
  }

  return (
    <>
      <style>{`
        

        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateY(-18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }

        .skin-heading-main {
          animation: fadeSlideDown 0.8s cubic-bezier(0.4,0,0.2,1) both;
        }
        .skin-heading-sub {
          animation: fadeSlideUp 0.9s 0.25s cubic-bezier(0.4,0,0.2,1) both;
        }
        .shimmer-gold {
          background: linear-gradient(90deg, #c9a96e 0%, #f5e4a0 35%, #c9a96e 55%, #edd98a 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3.5s linear infinite;
        }
        .accent-red {
          background: linear-gradient(135deg, #e05c5c 0%, #d4845a 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      <div className="relative overflow-hidden w-full h-full py-20">

        {/* Headings */}
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>

          {/* Your Skin Report */}
          <h1
            className="skin-heading-main"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(42px, 7vw, 82px)",
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              color: "white",
            }}
          >
            Your Skin{" "}
            <span className="shimmer-gold">Report</span>
          </h1>

          
          <div style={{
            width: "52px",
            height: "2px",
            background: "linear-gradient(90deg, transparent, #c9a96e, transparent)",
            margin: "16px auto 18px",
            borderRadius: "999px",
          }} />

          
          <h2
            className="skin-heading-sub"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "clamp(14px, 2.2vw, 20px)",
              fontWeight: 300,
              letterSpacing: "0.07em",
              color: "rgba(255,255,255,0.5)",
            }}
          >
            again, not so{" "}
            <span className="accent-red" style={{ fontWeight: 600 }}>generic</span>
            {" "}analysis
          </h2>
        </div>

        <Carousel slides={slideData} />
      </div>
    </>
  );
}
